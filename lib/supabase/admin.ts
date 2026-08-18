import { createClient } from "@supabase/supabase-js";

// Cliente com a chave SERVICE ROLE — ignora as regras de RLS.
// USAR SOMENTE NO SERVIDOR (webhooks de pagamento, tarefas administrativas,
// gerar links assinados de PDF). NUNCA importe isto em client components.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
