"use server";

import { createClient } from "@/lib/supabase/server";
import { getAcesso } from "@/lib/queries/account";
import type { Anotacao, RetanguloNorm } from "@/lib/types";

// Resolve o slug do livro para o id (uuid) e confere o acesso do usuário.
async function contexto(slug: string) {
  const acesso = await getAcesso();
  if (!acesso || (!acesso.isAdmin && !acesso.ativo)) return null;

  const supabase = await createClient();
  const { data: book } = await supabase
    .from("books")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (!book?.id) return null;

  return { supabase, userId: acesso.userId, bookId: book.id };
}

// Lista todas as anotações do usuário para um livro.
export async function listarAnotacoes(slug: string): Promise<Anotacao[]> {
  const ctx = await contexto(slug);
  if (!ctx) return [];

  const { data } = await ctx.supabase
    .from("annotations")
    .select("id, page, tipo, cor, texto, nota, rects, created_at")
    .eq("user_id", ctx.userId)
    .eq("book_id", ctx.bookId)
    .order("page", { ascending: true })
    .order("created_at", { ascending: true });

  return (data ?? []) as Anotacao[];
}

// Cria um grifo (destaque de trecho) com posição normalizada.
export async function criarGrifo(
  slug: string,
  page: number,
  rects: RetanguloNorm[],
  texto: string,
  cor = "amarelo"
): Promise<Anotacao | null> {
  const ctx = await contexto(slug);
  if (!ctx || !rects?.length) return null;

  const { data } = await ctx.supabase
    .from("annotations")
    .insert({
      user_id: ctx.userId,
      book_id: ctx.bookId,
      page: Math.max(1, Math.floor(page)),
      tipo: "grifo",
      cor,
      texto: texto?.slice(0, 2000) ?? null,
      rects,
    })
    .select("id, page, tipo, cor, texto, nota, rects, created_at")
    .maybeSingle();

  return (data as Anotacao) ?? null;
}

// Marca (ou desmarca) uma página como marcador.
export async function alternarMarcador(
  slug: string,
  page: number
): Promise<{ marcado: boolean }> {
  const ctx = await contexto(slug);
  if (!ctx) return { marcado: false };

  const p = Math.max(1, Math.floor(page));
  const { data: existente } = await ctx.supabase
    .from("annotations")
    .select("id")
    .eq("user_id", ctx.userId)
    .eq("book_id", ctx.bookId)
    .eq("tipo", "marcador")
    .eq("page", p)
    .maybeSingle();

  if (existente?.id) {
    await ctx.supabase.from("annotations").delete().eq("id", existente.id);
    return { marcado: false };
  }

  await ctx.supabase.from("annotations").insert({
    user_id: ctx.userId,
    book_id: ctx.bookId,
    page: p,
    tipo: "marcador",
  });
  return { marcado: true };
}

// Cria uma nota (opcionalmente ligada a um trecho selecionado).
export async function criarNota(
  slug: string,
  page: number,
  nota: string,
  texto?: string,
  rects?: RetanguloNorm[]
): Promise<Anotacao | null> {
  const ctx = await contexto(slug);
  if (!ctx || !nota?.trim()) return null;

  const { data } = await ctx.supabase
    .from("annotations")
    .insert({
      user_id: ctx.userId,
      book_id: ctx.bookId,
      page: Math.max(1, Math.floor(page)),
      tipo: "nota",
      nota: nota.trim().slice(0, 4000),
      texto: texto?.slice(0, 2000) ?? null,
      rects: rects?.length ? rects : null,
    })
    .select("id, page, tipo, cor, texto, nota, rects, created_at")
    .maybeSingle();

  return (data as Anotacao) ?? null;
}

// Exclui uma anotação (grifo, marcador ou nota) do próprio usuário.
export async function excluirAnotacao(id: string): Promise<{ ok: boolean }> {
  const acesso = await getAcesso();
  if (!acesso) return { ok: false };

  const supabase = await createClient();
  const { error } = await supabase
    .from("annotations")
    .delete()
    .eq("id", id)
    .eq("user_id", acesso.userId);

  return { ok: !error };
}
