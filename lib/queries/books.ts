import { createClient } from "@/lib/supabase/server";
import { rowToLivro, type BookRow, type Livro, type Categoria } from "@/lib/types";

// Converte linhas do banco em Livros, resolvendo a URL pública da capa (se houver).
function mapRows(rows: BookRow[], supabase: any): Livro[] {
  return rows.map((r) => {
    let coverUrl: string | undefined;
    if (r.cover_path) {
      coverUrl = supabase.storage.from("covers").getPublicUrl(r.cover_path)
        .data.publicUrl;
    }
    return rowToLivro(r, coverUrl);
  });
}

export async function getCatalogo(): Promise<Livro[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: true });
  return mapRows((data ?? []) as BookRow[], supabase);
}

export async function getLivro(slug: string): Promise<Livro | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return null;
  return mapRows([data as BookRow], supabase)[0];
}

export async function getLancamentos(): Promise<Livro[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("novos_lancamentos")
    .select("*");
  return mapRows((data ?? []) as BookRow[], supabase);
}

export async function getMaisLidos(limite = 8): Promise<Livro[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select("*")
    .order("nota", { ascending: false })
    .limit(limite);
  return mapRows((data ?? []) as BookRow[], supabase);
}

export async function getPorCategoria(cat: Categoria): Promise<Livro[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select("*")
    .contains("tags", [cat]);
  return mapRows((data ?? []) as BookRow[], supabase);
}

export async function getRelacionados(
  livro: Livro,
  limite = 4
): Promise<Livro[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select("*")
    .overlaps("tags", livro.tags)
    .neq("slug", livro.id)
    .limit(limite);
  return mapRows((data ?? []) as BookRow[], supabase);
}

export async function getDestaque(): Promise<Livro | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select("*")
    .eq("destaque", true)
    .limit(1)
    .maybeSingle();
  if (!data) {
    const catalogo = await getCatalogo();
    return catalogo[0] ?? null;
  }
  return mapRows([data as BookRow], supabase)[0];
}
