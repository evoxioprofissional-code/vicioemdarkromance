import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminHeading } from "@/components/admin/UI";
import NovoLivroForm from "@/components/admin/NovoLivroForm";
import { getLivro } from "@/lib/queries/books";

export default async function EditarLivroPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { erro?: string };
}) {
  const livro = await getLivro(params.slug);
  if (!livro) return notFound();

  return (
    <div>
      <Link
        href="/admin/catalogo"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Voltar ao catálogo
      </Link>
      <AdminHeading titulo="Editar livro" sub={livro.titulo} />
      <NovoLivroForm livro={livro} erro={searchParams.erro} />
    </div>
  );
}
