import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminHeading } from "@/components/admin/UI";
import NovoLivroForm from "@/components/admin/NovoLivroForm";

export default function NovoLivroPage() {
  return (
    <div>
      <Link
        href="/admin/catalogo"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Voltar ao catálogo
      </Link>
      <AdminHeading
        titulo="Adicionar livro"
        sub="Envie o PDF, defina a capa e publique no catálogo"
      />
      <NovoLivroForm />
    </div>
  );
}
