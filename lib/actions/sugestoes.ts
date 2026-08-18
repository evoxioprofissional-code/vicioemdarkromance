"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function sugerirLivro(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const autora = String(formData.get("autora") ?? "").trim();
  const comentario = String(formData.get("comentario") ?? "").trim();

  if (!titulo) {
    redirect("/plataforma/sugestoes?erro=" + encodeURIComponent("Informe ao menos o título."));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?redirect=/plataforma/sugestoes");

  const { error } = await supabase.from("book_suggestions").insert({
    user_id: user.id,
    titulo,
    autora: autora || null,
    comentario: comentario || null,
  });

  if (error) {
    redirect("/plataforma/sugestoes?erro=" + encodeURIComponent(error.message));
  }

  revalidatePath("/plataforma/sugestoes");
  redirect("/plataforma/sugestoes?ok=1");
}

export async function apagarSugestao(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // RLS garante que só a própria sugestão do usuário é apagada.
  await supabase.from("book_suggestions").delete().eq("id", id);
  revalidatePath("/plataforma/sugestoes");
}
