import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DocHeader } from "@/components/PageChrome";
import BookCard from "@/components/BookCard";
import { getLancamentos, getCatalogo } from "@/lib/queries/books";

export const metadata = { title: "Lançamentos — Vício em Dark Romance" };
export const dynamic = "force-dynamic";

export default async function LancamentosPage() {
  let livros = await getLancamentos();
  // Se não houver nada dentro da janela de 5 dias, mostramos os mais recentes.
  if (livros.length === 0) {
    const catalogo = await getCatalogo();
    livros = catalogo.slice(-8).reverse();
  }

  return (
    <article>
      <DocHeader
        eyebrow="O clube"
        titulo="Lançamentos"
        intro="Os títulos mais quentes que acabaram de chegar ao acervo. Assine e comece a ler agora mesmo."
      />

      {livros.length === 0 ? (
        <p className="text-white/55">Em breve, novos títulos por aqui.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {livros.map((l) => (
            <BookCard key={l.id} livro={l} />
          ))}
        </div>
      )}

      <div className="mt-12 rounded-2xl border border-champagne/15 bg-blood-900/15 p-6 text-center">
        <h2 className="font-display text-2xl font-bold text-white">
          Quer ler todos eles?
        </h2>
        <p className="mt-2 text-white/60">
          Uma assinatura libera a biblioteca completa e todos os lançamentos.
        </p>
        <Link href="/#planos" className="btn-primary mt-4">
          Assinar agora <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
