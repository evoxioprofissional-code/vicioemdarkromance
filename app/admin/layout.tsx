import AdminShell from "@/components/admin/AdminShell";

// Painel administrativo (protótipo — dados mockados, sem back-end).
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
