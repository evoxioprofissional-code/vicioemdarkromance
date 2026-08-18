"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Ativa a assinatura do usuário logado.
 * OBS: enquanto o gateway de pagamento não está conectado, esta ação apenas
 * registra a assinatura e um pagamento manual — quando o gateway entrar, quem
 * fará isso é o webhook de confirmação de pagamento.
 */
export async function finalizarAssinatura() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar?redirect=/checkout");

  const admin = createAdminClient();
  const agora = new Date();
  const fim = new Date(agora.getTime() + 30 * 86400000);

  await admin.from("subscriptions").upsert(
    {
      user_id: user.id,
      status: "active",
      plano: "mensal",
      price_cents: 999,
      current_period_end: fim.toISOString(),
      updated_at: agora.toISOString(),
    },
    { onConflict: "user_id" }
  );

  await admin.from("payments").insert({
    user_id: user.id,
    amount_cents: 999,
    method: "manual",
    status: "paid",
    paid_at: agora.toISOString(),
  });

  redirect("/plataforma");
}
