"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function entrar(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/plataforma") || "/plataforma";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/entrar?erro=" + encodeURIComponent("E-mail ou senha incorretos."));
  }
  redirect(redirectTo);
}

export async function cadastrar(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (password.length < 6) {
    redirect("/cadastrar?erro=" + encodeURIComponent("A senha precisa ter ao menos 6 caracteres."));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nome } },
  });

  if (error) {
    redirect("/cadastrar?erro=" + encodeURIComponent(error.message));
  }

  // Sem sessão = confirmação de e-mail pendente.
  if (!data.session) {
    redirect("/entrar?aviso=" + encodeURIComponent("Confirme seu e-mail para entrar."));
  }
  redirect("/plataforma");
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
