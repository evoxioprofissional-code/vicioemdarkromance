import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import LeitorClient from "@/components/LeitorClient";
import { getLivro } from "@/lib/queries/books";
import { exigirAcessoConteudo, getProgressoLivro } from "@/lib/queries/account";
import { listarAnotacoes } from "@/lib/actions/anotacoes";

export const dynamic = "force-dynamic";

export default async function LerPage({ params }: { params: { id: string } }) {
  await exigirAcessoConteudo();

  const livro = await getLivro(params.id);
  if (!livro) return notFound();

  // Sem PDF cadastrado ainda.
  if (!livro.temPdf) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <BookOpen className="mx-auto text-champagne" />
        <h1 className="mt-4 font-display text-2xl font-bold text-white">
          {livro.titulo}
        </h1>
        <p className="mt-2 text-white/55">O PDF deste livro ainda não está disponível.</p>
        <Link href={`/plataforma/livro/${livro.id}`} className="btn-ghost mt-6 !py-2.5">
          Voltar ao livro
        </Link>
      </div>
    );
  }

  const [progresso, anotacoes] = await Promise.all([
    getProgressoLivro(livro.id),
    listarAnotacoes(livro.id),
  ]);

  return (
    <LeitorClient
      slug={livro.id}
      titulo={livro.titulo}
      fileUrl={`/plataforma/livro/${livro.id}/arquivo`}
      startPage={progresso?.currentPage ?? 1}
      anotacoesIniciais={anotacoes}
    />
  );
}
