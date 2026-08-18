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

  // Upload do PDF (se enviado) no bucket privado.
  let pdf_path: string | null = null;
  const pdf = formData.get("pdf") as File | null;
  if (pdf && pdf.size > 0) {
    const path = `${slug}.pdf`;
    const { error } = await admin.storage
      .from("pdfs")
      .upload(path, pdf, { upsert: true, contentType: "application/pdf" });
    if (!error) pdf_path = path;
  }

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
  });

  if (error) {
    redirect("/admin/catalogo/novo?erro=" + encodeURIComponent(error.message));
  }

  revalidatePath("/admin/catalogo");
  revalidatePath("/plataforma");
  revalidatePath("/");
  redirect("/admin/catalogo?ok=1");
}
