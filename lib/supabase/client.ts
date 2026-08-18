import { createBrowserClient } from "@supabase/ssr";

// Cliente Supabase para uso no NAVEGADOR (client components).
// Usa a chave "anon" (pública) — segura para expor no front.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// true quando as variáveis de ambiente do Supabase já foram configuradas.
export const supabaseConfigurado = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
