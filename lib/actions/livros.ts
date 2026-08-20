"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "e")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export async function criarLivro(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const autora = String(formData.get("autora") ?? "").trim();
  if (!titulo || !autora) {
    redirect("/admin/catalogo/novo?erro=" + encodeURIComponent("Título e autora são obrigatórios."));
  }

  const selo = String(formData.get("selo") ?? "").trim();
  const sinopse = String(formData.get("sinopse") ?? "").trim();
  const capa_de = String(formData.get("capa_de") ?? "#2a0510");
  const capa_para = String(formData.get("capa_para") ?? "#a11d2e");
  const paginas = Number(formData.get("paginas") ?? 0) || 0;
  const tagsRaw = String(formData.get("tags") ?? "");
  const tags = tagsRaw ? tagsRaw.split(",").filter(Boolean) : [];
  const novo = String(formData.get("novo") ?? "") === "1";

  const admin = await createClient();
  const slug = slugify(titulo) || `livro-${Date.now()}`;

  // Os arquivos já foram enviados direto do navegador pro storage;
  // aqui recebemos apenas os caminhos.
  const pdf_path = String(formData.get("pdf_path") ?? "") || null;
  const cover_path = String(formData.get("cover_path") ?? "") || null;

  const { error } = await admin.from("books").insert({
    slug,
    titulo,
    autora,
    selo: selo || null,
    sinopse: sinopse || null,
    paginas,
    ano: new Date().getFullYear(),
    tags,
    capa_de,
    capa_para,
    novo,
    lancado_em: novo ? new Date().toISOString().slice(0, 10) : null,
    pdf_path,
    cover_path,
  });

  if (error) {
    redirect("/admin/catalogo/novo?erro=" + encodeURIComponent(error.message));
  }

  revalidatePath("/admin/catalogo");
  revalidatePath("/plataforma");
  revalidatePath("/");
  redirect("/admin/catalogo?ok=1");
}

function revalidarTudo() {
  revalidatePath("/admin/catalogo");
  revalidatePath("/plataforma");
  revalidatePath("/");
}

// Atualiza um livro existente (RLS: só admin).
export async function atualizarLivro(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const autora = String(formData.get("autora") ?? "").trim();
  if (!slug || !titulo || !autora) {
    redirect("/admin/catalogo?erro=" + encodeURIComponent("Dados inválidos."));
  }

  const selo = String(formData.get("selo") ?? "").trim();
  const sinopse = String(formData.get("sinopse") ?? "").trim();
  const capa_de = String(formData.get("capa_de") ?? "#2a0510");
  const capa_para = String(formData.get("capa_para") ?? "#a11d2e");
  const paginas = Number(formData.get("paginas") ?? 0) || 0;
  const tagsRaw = String(formData.get("tags") ?? "");
  const tags = tagsRaw ? tagsRaw.split(",").filter(Boolean) : [];
  const novo = String(formData.get("novo") ?? "") === "1";

  const supabase = await createClient();

  const updates: Record<string, unknown> = {
    titulo,
    autora,
    selo: selo || null,
    sinopse: sinopse || null,
    paginas,
    tags,
    capa_de,
    capa_para,
    novo,
    lancado_em: novo ? new Date().toISOString().slice(0, 10) : null,
  };

  // Arquivos enviados no navegador → recebemos os caminhos.
  const novoPdf = String(formData.get("pdf_path") ?? "");
  if (novoPdf) updates.pdf_path = novoPdf;

  const novaCapa = String(formData.get("cover_path") ?? "");
  if (novaCapa) {
    updates.cover_path = novaCapa;
  } else if (String(formData.get("remover_capa") ?? "") === "1") {
    updates.cover_path = null;
  }

  const { error } = await supabase.from("books").update(updates).eq("slug", slug);
  if (error) {
    redirect(`/admin/catalogo/${slug}/editar?erro=` + encodeURIComponent(error.message));
  }

  revalidarTudo();
  redirect("/admin/catalogo?ok=editado");
}

// Exclui um livro (RLS: só admin). Remove também os arquivos do storage.
export async function excluirLivro(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;

  const supabase = await createClient();
  const { data: book } = await supabase
    .from("books")
    .select("pdf_path, cover_path")
    .eq("slug", slug)
    .maybeSingle();

  const { error } = await supabase.from("books").delete().eq("slug", slug);
  if (error) {
    redirect("/admin/catalogo?erro=" + encodeURIComponent(error.message));
  }

  if (book?.pdf_path) await supabase.storage.from("pdfs").remove([book.pdf_path]);
  if (book?.cover_path) await supabase.storage.from("covers").remove([book.cover_path]);

  revalidarTudo();
  redirect("/admin/catalogo?ok=removido");
}
