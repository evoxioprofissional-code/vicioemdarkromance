import Link from "next/link";
import { Plus, BookCopy, Clock, Star } from "lucide-react";
import { StatCard, AdminHeading } from "@/components/admin/UI";
import CatalogoManager from "@/components/admin/CatalogoManager";
import { livros, emLancamento } from "@/data/livros";

export default function CatalogoPage() {
  const emVitrine = livros.filter((l) => emLancamento(l)).length;
  const notaMedia =
    livros.reduce((s, l) => s + l.nota, 0) / livros.length;

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

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Títulos no acervo" valor={String(livros.length)} icon={<BookCopy size={18} />} destaque />
        <StatCard label="Em novos lançamentos" valor={String(emVitrine)} icon={<Clock size={18} />} />
        <StatCard label="Nota média" valor={notaMedia.toFixed(1).replace(".", ",")} icon={<Star size={18} />} />
      </div>

      <div className="mt-4 rounded-xl border border-champagne/15 bg-blood-900/15 px-4 py-3 text-sm text-white/60">
        <Clock size={14} className="mr-1.5 inline text-champagne" />
        Ao publicar um livro marcado como <strong className="text-white/80">Novo lançamento</strong>,
        ele aparece na vitrine da home por <strong className="text-white/80">5 dias</strong> e sai automaticamente.
      </div>

      <div className="mt-6">
        <CatalogoManager />
      </div>
    </div>
  );
}
