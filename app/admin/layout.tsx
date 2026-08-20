import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getPerfil } from "@/lib/queries/account";

// Painel administrativo — exige usuário com papel "admin".
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const perfil = await getPerfil();
  if (!perfil) redirect("/entrar?redirect=/admin");
  if (perfil.role !== "admin") redirect("/plataforma");

  const inicial = (perfil.nome || perfil.email || "A").charAt(0).toUpperCase();
  return <AdminShell inicial={inicial}>{children}</AdminShell>;
}
