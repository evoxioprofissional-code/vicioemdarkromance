import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { WEBHOOK_SECRET } from "@/lib/payments/config";
import {
  getPreapprovalMP,
  getAuthorizedPaymentMP,
  getPaymentMP,
} from "@/lib/payments/mercadopago";

export const dynamic = "force-dynamic";

// Webhook do Mercado Pago (assinatura de cartão recorrente).
// Sincroniza o status da assinatura buscando o recurso na API (com nosso
// token), então ativa/desativa o acesso via função protegida do banco.
export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  if (params.token !== WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const url = new URL(req.url);
  let body: Record<string, any> = {};
  try {
    body = await req.json();
  } catch {
    /* algumas notificações vêm só por query string */
  }

  const type = String(
    body.type ?? body.action ?? url.searchParams.get("type") ?? url.searchParams.get("topic") ?? ""
  );
  const id = String(
    body?.data?.id ?? body.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id") ?? ""
  );
  if (!id) return NextResponse.json({ ok: true, skip: "no_id" });

  // Resolve para uma assinatura (preapproval) + eventual pagamento.
  let preapprovalId: string | null = null;
  let txId: string | null = null;

  if (type.includes("preapproval")) {
    preapprovalId = id;
  } else if (type.includes("authorized_payment") || type.includes("subscription")) {
    const ap = await getAuthorizedPaymentMP(id);
    if (ap?.preapproval_id) {
      preapprovalId = String(ap.preapproval_id);
      txId = String(ap?.payment?.id ?? ap.id);
    }
  } else if (type.includes("payment")) {
    const p = await getPaymentMP(id);
    if (p) {
      txId = String(p.id);
      // pagamento de assinatura costuma trazer o preapproval em metadata/ref
      preapprovalId =
        p?.metadata?.preapproval_id ??
        p?.point_of_interaction?.transaction_data?.subscription_id ??
        null;
      // fallback: external_reference é o user_id
      if (!preapprovalId && p?.external_reference && p?.status === "approved") {
        return await ativarPorUsuario(p.external_reference, null, txId);
      }
    }
  }

  if (!preapprovalId) return NextResponse.json({ ok: true, skip: "no_preapproval" });

  const pa = await getPreapprovalMP(preapprovalId);
  if (!pa) return NextResponse.json({ ok: true, skip: "preapproval_not_found" });

  const userId: string | null = pa.external_reference ?? null;
  const status: string = pa.status ?? "";
  const amountCents = Math.round(((pa.auto_recurring?.transaction_amount ?? 9.99) as number) * 100);
  const nextEnd = pa.next_payment_date ? new Date(pa.next_payment_date).toISOString() : null;

  if (!userId) return NextResponse.json({ ok: true, skip: "no_user" });

  const supabase = await createClient();
  if (status === "authorized") {
    await supabase.rpc("ativar_assinatura_usuario", {
      p_secret: WEBHOOK_SECRET,
      p_user_id: userId,
      p_gateway: "mercadopago",
      p_sub_id: preapprovalId,
      p_amount_cents: amountCents,
      p_period_end: nextEnd,
      p_method: "card",
      p_tx_id: txId,
    });
  } else if (status === "cancelled" || status === "paused") {
    await supabase.rpc("desativar_assinatura_usuario", {
      p_secret: WEBHOOK_SECRET,
      p_user_id: userId,
    });
  }

  return NextResponse.json({ ok: true, status });
}

async function ativarPorUsuario(userId: string, periodEnd: string | null, txId: string | null) {
  const supabase = await createClient();
  await supabase.rpc("ativar_assinatura_usuario", {
    p_secret: WEBHOOK_SECRET,
    p_user_id: userId,
    p_gateway: "mercadopago",
    p_sub_id: null,
    p_amount_cents: 999,
    p_period_end: periodEnd,
    p_method: "card",
    p_tx_id: txId,
  });
  return NextResponse.json({ ok: true, via: "external_reference" });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
