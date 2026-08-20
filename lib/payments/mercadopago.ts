import { MP_ACCESS_TOKEN, SITE_URL, WEBHOOK_SECRET } from "./config";

const MP = "https://api.mercadopago.com";

function auth() {
  return { Authorization: `Bearer ${MP_ACCESS_TOKEN}` };
}

/**
 * Cria uma assinatura recorrente (preapproval) de R$ 9,99/mês e devolve o
 * init_point — a URL onde o cliente autoriza o cartão.
 */
export async function criarAssinaturaMP(params: {
  userId: string;
  email: string;
  amount?: number;
}): Promise<string | null> {
  if (!MP_ACCESS_TOKEN) return null; // cartão não configurado
  try {
    const res = await fetch(`${MP}/preapproval`, {
      method: "POST",
      headers: { ...auth(), "Content-Type": "application/json" },
      body: JSON.stringify({
        reason: "Assinatura Acesso Total — Vício em Dark Romance",
        external_reference: params.userId,
        payer_email: params.email,
        back_url: `${SITE_URL}/checkout/sucesso`,
        notification_url: `${SITE_URL}/api/webhooks/mercadopago/${WEBHOOK_SECRET}`,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: params.amount ?? 9.99,
          currency_id: "BRL",
        },
      }),
      cache: "no-store",
    });
    const data = await res.json();
    return typeof data?.init_point === "string" ? data.init_point : null;
  } catch {
    return null;
  }
}

export async function getPreapprovalMP(id: string) {
  const res = await fetch(`${MP}/preapproval/${id}`, { headers: auth(), cache: "no-store" });
  return res.ok ? res.json() : null;
}

export async function getAuthorizedPaymentMP(id: string) {
  const res = await fetch(`${MP}/authorized_payments/${id}`, { headers: auth(), cache: "no-store" });
  return res.ok ? res.json() : null;
}

export async function getPaymentMP(id: string) {
  const res = await fetch(`${MP}/v1/payments/${id}`, { headers: auth(), cache: "no-store" });
  return res.ok ? res.json() : null;
}
