// Configuração de pagamento. Segue o mesmo padrão do Supabase: usa o env se
// for válido (ASCII), senão cai num valor padrão limpo — evita quebrar caso a
// variável seja colada corrompida no ambiente.

const FALLBACK_SITE = "https://vicioemdarkromance.vercel.app";
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
