"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Finalizar assinatura.
 *
 * O meio de pagamento (InfinitePay) ainda não está conectado, então NENHUM
 * acesso é liberado aqui — isso evita acesso grátis. Quando o gateway entrar,
 * quem ativa a assinatura é o webhook de confirmação de pagamento.
 */
export async function finalizarAssinatura() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar?redirect=/checkout");

  // Sem gateway conectado: apenas sinaliza que o pagamento está a caminho.
  redirect("/checkout?pendente=1");
}

export async function cancelarAssinatura() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?redirect=/plataforma/conta");

  const admin = createAdminClient();
  await admin
    .from("subscriptions")
    .update({ status: "canceled", canceled_at: new Date().toISOString() })
    .eq("user_id", user.id);

  revalidatePath("/plataforma/conta");
  redirect("/plataforma/conta?cancelada=1");
}
