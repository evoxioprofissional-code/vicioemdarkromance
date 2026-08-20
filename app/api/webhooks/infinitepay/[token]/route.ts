import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { WEBHOOK_SECRET } from "@/lib/payments/config";

export const dynamic = "force-dynamic";

// Recebe a confirmação de pagamento da InfinitePay e libera o acesso.
// O token vai no caminho da URL (sempre preservado) e a função do banco
// exige o mesmo segredo — dupla proteção, sem service_role.
export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  if (params.token !== WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const orderNsu = String(body.order_nsu ?? "");
  const transactionNsu = String(body.transaction_nsu ?? "");
  const amount = Number(body.paid_amount ?? body.amount ?? 0);
  if (!orderNsu) {
    return NextResponse.json({ ok: false, error: "missing_order" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("confirmar_pagamento", {
    p_secret: WEBHOOK_SECRET,
    p_order_nsu: orderNsu,
    p_transaction_nsu: transactionNsu,
    p_amount_cents: amount || 999,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 200 });
  }
  return NextResponse.json({ ok: true, result: data }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
