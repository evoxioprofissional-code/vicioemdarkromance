import Link from "next/link";
import { SearchX, LibraryBig } from "lucide-react";
import BookCard from "@/components/BookCard";
import { buscarLivros } from "@/lib/queries/books";
import { exigirAcessoConteudo } from "@/lib/queries/account";

export const dynamic = "force-dynamic";

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  await exigirAcessoConteudo();

  const termo = (searchParams.q ?? "").trim();
  const resultados = termo ? await buscarLivros(termo) : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
          {termo ? (
            <>
              Resultados para{" "}
              <span className="text-champagne">“{termo}”</span>
            </>
          ) : (
            "Buscar livros"
          )}
        </h1>
        {termo && (
          <p className="mt-1 text-sm text-white/45">
            {resultados.length}{" "}
            {resultados.length === 1 ? "livro encontrado" : "livros encontrados"}
          </p>
        )}
      </div>

      {!termo ? (
        <div className="glass rounded-2xl p-10 text-center">
          <LibraryBig className="mx-auto text-champagne" />
          <p className="mt-3 text-white/55">
            Digite na barra de busca acima para encontrar livros por título ou
            autora.
          </p>
        </div>
      ) : resultados.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <SearchX className="mx-auto text-champagne" />
          <p className="mt-3 text-white/70">
            Nenhum livro encontrado para “{termo}”.
          </p>
          <p className="mt-1 text-sm text-white/45">
            Tente outro termo, ou explore a biblioteca completa.
          </p>
          <Link href="/plataforma" className="btn-primary mt-5 !py-2.5">
            Ver biblioteca
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {resultados.map((l) => (
            <BookCard key={l.id} livro={l} href={`/plataforma/livro/${l.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
