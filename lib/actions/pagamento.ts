"use server";

import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { criarLinkInfinitePay } from "@/lib/payments/infinitepay";

const PRECO_CENTS = 999;

// Inicia o pagamento na InfinitePay. O checkout hospedado da InfinitePay
// aceita Pix, cartão de crédito e Apple Pay na mesma página — cria o pedido,
// gera o link e redireciona o cliente para pagar.
export async function iniciarPagamento() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?redirect=/checkout");

  const orderNsu = randomUUID();

  const { error } = await supabase.from("payment_orders").insert({
    order_nsu: orderNsu,
    user_id: user.id,
    gateway: "infinitepay",
    amount_cents: PRECO_CENTS,
    status: "pending",
  });
  if (error) {
    redirect("/checkout?erro=" + encodeURIComponent("Não foi possível iniciar o pagamento. Tente de novo."));
  }

  const url = await criarLinkInfinitePay({
    orderNsu,
    amountCents: PRECO_CENTS,
    description: "Assinatura Acesso Total — Vício em Dark Romance",
  });

  if (!url) {
    redirect("/checkout?erro=" + encodeURIComponent("Não foi possível gerar o pagamento. Tente novamente em instantes."));
  }

  redirect(url); // vai para o checkout da InfinitePay (Pix / cartão / Apple Pay)
}
