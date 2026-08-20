import Link from "next/link";
import { Plus, BookCopy, Clock, Star, CheckCircle2, AlertCircle } from "lucide-react";
import { StatCard, AdminHeading } from "@/components/admin/UI";
import CatalogoManager from "@/components/admin/CatalogoManager";
import { getCatalogo } from "@/lib/queries/books";
import { emLancamento } from "@/lib/types";

const OK_MSG: Record<string, string> = {
  "1": "Livro publicado com sucesso.",
  editado: "Livro atualizado.",
  removido: "Livro excluído.",
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: { ok?: string; erro?: string };
}) {
  const livros = await getCatalogo();
  const emVitrine = livros.filter((l) => emLancamento(l)).length;
  const notaMedia = livros.length
    ? livros.reduce((s, l) => s + l.nota, 0) / livros.length
    : 0;

  return (
    <div>
      <AdminHeading
        titulo="Catálogo & PDFs"
        sub="Gerencie os livros, capas e a vitrine de novos lançamentos"
        acao={
          <Link href="/admin/catalogo/novo" className="btn-primary !py-2.5 !text-[13px]">
            <Plus size={15} /> Adicionar livro
          </Link>
        }
      />

      {searchParams.ok && OK_MSG[searchParams.ok] && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300">
          <CheckCircle2 size={15} /> {OK_MSG[searchParams.ok]}
        </div>
      )}
      {searchParams.erro && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-blood-600/40 bg-blood-900/30 px-3 py-2.5 text-sm text-smoke">
          <AlertCircle size={15} /> {searchParams.erro}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Títulos no acervo" valor={String(livros.length)} icon={<BookCopy size={18} />} destaque />
        <StatCard label="Em novos lançamentos" valor={String(emVitrine)} icon={<Clock size={18} />} />
        <StatCard label="Nota média" valor={notaMedia ? notaMedia.toFixed(1).replace(".", ",") : "—"} icon={<Star size={18} />} />
      </div>

      <div className="mt-4 rounded-xl border border-champagne/15 bg-blood-900/15 px-4 py-3 text-sm text-white/60">
        <Clock size={14} className="mr-1.5 inline text-champagne" />
        Ao publicar um livro marcado como <strong className="text-white/80">Novo lançamento</strong>,
        ele aparece na vitrine da home por <strong className="text-white/80">5 dias</strong> e sai automaticamente.
      </div>

      <div className="mt-6">
        {livros.length > 0 ? (
          <CatalogoManager livros={livros} />
        ) : (
          <div className="glass rounded-2xl p-10 text-center text-sm text-white/45">
            Nenhum livro cadastrado. Clique em “Adicionar livro” para começar.
          </div>
        )}
      </div>
    </div>
  );
}
