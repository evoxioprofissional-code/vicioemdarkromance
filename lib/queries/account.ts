import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface Perfil {
  id: string;
  nome: string;
  email: string;
  role: "assinante" | "admin";
  createdAt: string;
}

export interface Assinatura {
  status: "active" | "past_due" | "canceled" | "inactive";
  plano: string;
  priceCents: number;
  currentPeriodEnd: string | null;
}

export interface Acesso {
  userId: string;
  isAdmin: boolean;
  ativo: boolean; // assinatura ativa e vigente
}

// Situação de acesso do usuário logado.
export async function getAcesso(): Promise<Acesso | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: prof } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .maybeSingle();

  const ativo =
    sub?.status === "active" &&
    (!sub.current_period_end || new Date(sub.current_period_end) > new Date());

  return { userId: user.id, isAdmin: prof?.role === "admin", ativo: !!ativo };
}

// Garante que o usuário tem acesso ao conteúdo (assinante ativo ou admin).
// Caso contrário, redireciona.
export async function exigirAcessoConteudo() {
  const acesso = await getAcesso();
  if (!acesso) redirect("/entrar?redirect=/plataforma");
  if (!acesso.isAdmin && !acesso.ativo) redirect("/plataforma/conta?assine=1");
  return acesso;
}

// Usuário autenticado (ou null).
export async function getUsuarioAtual() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Perfil completo do usuário logado.
export async function getPerfil(): Promise<Perfil | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: p } = await supabase
    .from("profiles")
    .select("id, nome, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    nome: p?.nome || user.email?.split("@")[0] || "Leitora",
    email: user.email ?? "",
    role: (p?.role as "assinante" | "admin") ?? "assinante",
    createdAt: p?.created_at ?? user.created_at,
  };
}

export async function getMinhaAssinatura(): Promise<Assinatura | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("subscriptions")
    .select("status, plano, price_cents, current_period_end")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) {
    return { status: "inactive", plano: "mensal", priceCents: 999, currentPeriodEnd: null };
  }
  return {
    status: data.status,
    plano: data.plano ?? "mensal",
    priceCents: data.price_cents ?? 999,
    currentPeriodEnd: data.current_period_end,
  };
}

export interface Sugestao {
  id: string;
  titulo: string;
  autora: string | null;
  comentario: string | null;
  status: "pendente" | "avaliando" | "adicionado" | "recusado";
  created_at: string;
}

// Sugestões de livros enviadas pelo usuário.
export async function getMinhasSugestoes(): Promise<Sugestao[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("book_suggestions")
    .select("id, titulo, autora, comentario, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data ?? []) as Sugestao[];
}

// Progresso de leitura do usuário (para "continuar lendo" / "lidos recentemente").
export async function getMeuProgresso() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("reading_progress")
    .select(
      "percent, current_page, total_pages, updated_at, books(slug, titulo, autora, nota, capa_de, capa_para, cover_path)"
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return data ?? [];
}

// Progresso de UM livro específico (usado pelo leitor para retomar a página).
export async function getProgressoLivro(
  slug: string
): Promise<{ currentPage: number; percent: number } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: book } = await supabase
    .from("books")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (!book?.id) return null;

  const { data } = await supabase
    .from("reading_progress")
    .select("current_page, percent")
    .eq("user_id", user.id)
    .eq("book_id", book.id)
    .maybeSingle();

  if (!data) return null;
  return { currentPage: data.current_page ?? 1, percent: data.percent ?? 0 };
}
