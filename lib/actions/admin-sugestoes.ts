"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const STATUS_VALIDOS = ["pendente", "avaliando", "adicionado", "recusado"];

// Garante que quem chama é admin (server actions são invocáveis por qualquer
// usuário logado — então a checagem de papel é obrigatória aqui).
async function exigirAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  return data?.role === "admin";
}

export async function atualizarStatusSugestao(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !STATUS_VALIDOS.includes(status)) return;

  if (!(await exigirAdmin())) return;

  const db = createAdminClient();
  await db.from("book_suggestions").update({ status }).eq("id", id);
  revalidatePath("/admin/sugestoes");
}
