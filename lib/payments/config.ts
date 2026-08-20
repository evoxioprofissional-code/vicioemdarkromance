// Configuração de pagamento. Segue o mesmo padrão do Supabase: usa o env se
// for válido (ASCII), senão cai num valor padrão limpo — evita quebrar caso a
// variável seja colada corrompida no ambiente.

const FALLBACK_SITE = "https://vicioemdarkromance.com.br";
const FALLBACK_HANDLE = "vcbrilhante";
const FALLBACK_SECRET =
  "vdr_whk_7b87bcb2a323a8d530d6058978b88815e8023b01575aa9e6";

function limpo(v?: string): v is string {
  return !!v && /^[\x21-\x7E]+$/.test(v);
}

export const SITE_URL = limpo(process.env.NEXT_PUBLIC_SITE_URL)
  ? process.env.NEXT_PUBLIC_SITE_URL
  : FALLBACK_SITE;

export const INFINITEPAY_HANDLE = limpo(process.env.INFINITEPAY_HANDLE)
  ? process.env.INFINITEPAY_HANDLE
  : FALLBACK_HANDLE;

// Segredo compartilhado entre o nosso webhook e a função do banco.
export const WEBHOOK_SECRET = limpo(process.env.INFINITEPAY_WEBHOOK_SECRET)
  ? process.env.INFINITEPAY_WEBHOOK_SECRET
  : FALLBACK_SECRET;

// ---- Mercado Pago (cartão recorrente) ----
const FALLBACK_MP_TOKEN =
  "APP_USR-6806275925209624-082014-6dd280d7fa44dbd7755c8bd3b136bdad-2200869116";
const FALLBACK_MP_PUBLIC = "APP_USR-2c85cbc4-8bcb-45af-a9bf-862dfaf396d4";

export const MP_ACCESS_TOKEN = limpo(process.env.MERCADOPAGO_ACCESS_TOKEN)
  ? process.env.MERCADOPAGO_ACCESS_TOKEN
  : FALLBACK_MP_TOKEN;

export const MP_PUBLIC_KEY = limpo(process.env.MERCADOPAGO_PUBLIC_KEY)
  ? process.env.MERCADOPAGO_PUBLIC_KEY
  : FALLBACK_MP_PUBLIC;
