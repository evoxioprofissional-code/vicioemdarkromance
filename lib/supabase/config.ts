// URL e chave ANON são PÚBLICAS por design (vão para o navegador em qualquer
// app Supabase — não são segredo). Mantemos um valor padrão limpo do projeto e
// deixamos o ambiente sobrescrever SOMENTE se o valor for ASCII válido — isso
// evita quebrar o app quando a chave é colada corrompida (ex.: caractere "•").
//
// IMPORTANTE: a chave service_role (secreta) NÃO fica aqui — só no env.

const FALLBACK_URL = "https://hbeiaebbrfwcreftwazz.supabase.co";
const FALLBACK_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZWlhZWJicmZ3Y3JlZnR3YXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNjg1NDYsImV4cCI6MjEwMjY0NDU0Nn0.npas9HYTlEzfLl2zTO92oJF258UjLV9z064EoOB26pk";

// Válido = existe e só tem caracteres ASCII imprimíveis (sem "•" e afins).
function limpo(v?: string): v is string {
  return !!v && /^[\x21-\x7E]+$/.test(v);
}

export const SUPABASE_URL = limpo(process.env.NEXT_PUBLIC_SUPABASE_URL)
  ? process.env.NEXT_PUBLIC_SUPABASE_URL
  : FALLBACK_URL;

export const SUPABASE_ANON_KEY = limpo(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  : FALLBACK_ANON;
