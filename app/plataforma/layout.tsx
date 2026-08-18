import PlatformShell from "@/components/PlatformShell";

// Área do assinante (mock de usuário "logado").
export default function PlataformaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PlatformShell>{children}</PlatformShell>;
}
