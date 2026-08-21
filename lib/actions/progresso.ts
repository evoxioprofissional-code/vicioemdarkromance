"use server";

import { createClient } from "@/lib/supabase/server";
import { getAcesso } from "@/lib/queries/account";

// Salva a página onde o leitor parou. Chamada pelo leitor no site a cada
// mudança de página (com debounce no cliente). Faz upsert em reading_progress.
export async function salvarProgresso(
  slug: string,
  currentPage: number,
  totalPages: number
): Promise<{ ok: boolean }> {
  const acesso = await getAcesso();
  if (!acesso || (!acesso.isAdmin && !acesso.ativo)) {
    return { ok: false };
  }

  const supabase = await createClient();

  const { data: book } = await supabase
    .from("books")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (!book?.id) return { ok: false };

  const total = Math.max(1, Math.floor(totalPages || 1));
  const page = Math.min(Math.max(1, Math.floor(currentPage || 1)), total);
  const percent = Math.min(100, Math.max(0, Math.round((page / total) * 100)));

  const { error } = await supabase.from("reading_progress").upsert(
    {
      user_id: acesso.userId,
      book_id: book.id,
      current_page: page,
      total_pages: total,
      percent,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,book_id" }
  );

  return { ok: !error };
}
