import { INFINITEPAY_HANDLE, SITE_URL, WEBHOOK_SECRET } from "./config";

const API = "https://api.checkout.infinitepay.io/links";

/**
 * Cria um link de pagamento na InfinitePay (Pix/cartão) e devolve a URL.
 * order_nsu amarra o pagamento ao pedido do nosso banco; o webhook_url leva o
 * token secreto para validarmos a confirmação.
 */
export async function criarLinkInfinitePay(params: {
  orderNsu: string;
  amountCents: number;
  description: string;
}): Promise<string | null> {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        handle: INFINITEPAY_HANDLE,
        order_nsu: params.orderNsu,
        redirect_url: `${SITE_URL}/checkout/sucesso`,
        webhook_url: `${SITE_URL}/api/webhooks/infinitepay/${WEBHOOK_SECRET}`,
        items: [
          {
            quantity: 1,
            price: params.amountCents,
            description: params.description,
          },
        ],
      }),
      cache: "no-store",
    });
    const data = await res.json();
    return typeof data?.url === "string" ? data.url : null;
  } catch {
    return null;
  }
}
