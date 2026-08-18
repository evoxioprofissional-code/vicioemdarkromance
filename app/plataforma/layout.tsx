import PlatformShell from "@/components/PlatformShell";
import { getPerfil } from "@/lib/queries/account";

// Área do assinante (exige login — garantido pelo middleware).
export default async function PlataformaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const perfil = await getPerfil();
  const inicial = (perfil?.nome || perfil?.email || "•").charAt(0).toUpperCase();

  return <PlatformShell inicial={inicial}>{children}</PlatformShell>;
}
