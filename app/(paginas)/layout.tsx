import PageChrome from "@/components/PageChrome";

// Layout das páginas institucionais (rodapé): topo simples + rodapé.
export default function PaginasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageChrome>{children}</PageChrome>;
}
