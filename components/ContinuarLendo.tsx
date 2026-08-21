import Link from "next/link";
import { History } from "lucide-react";

interface ItemProgresso {
  percent: number;
  current_page: number;
  total_pages: number | null;
  books: {
    slug: string;
    titulo: string;
    autora: string;
    capa_de: string | null;
    capa_para: string | null;
  } | null;
}

/**
 * Prateleira "Continuar lendo / Lidos recentemente".
 * Mostra os livros com leitura em andamento, ordenados do mais recente,
 * com a barra de progresso e link direto para retomar no leitor.
 */
export default function ContinuarLendo({ itens }: { itens: ItemProgresso[] }) {
  const lista = itens.filter((p) => p.books);
  if (lista.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <History size={18} className="text-champagne" />
        <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
          Continuar lendo
        </h2>
      </div>

      <div className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto scroll-smooth px-1 pb-2">
        {lista.map((p, i) => {
          const l = p.books!;
          return (
            <Link
              key={i}
              href={`/plataforma/livro/${l.slug}/ler`}
              className="group w-[240px] shrink-0 rounded-2xl border border-white/5 bg-ink-800/40 p-3 transition-colors hover:border-champagne/25"
            >
              <div className="flex gap-3">
                <span
                  className="grid h-20 w-14 shrink-0 place-items-center rounded-md text-[8px] font-bold uppercase text-white/70 ring-1 ring-white/10"
                  style={{
                    background: `linear-gradient(160deg, ${l.capa_para ?? "#a11d2e"}, ${l.capa_de ?? "#2a0510"})`,
                  }}
                >
                  V
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-semibold text-white">
                    {l.titulo}
                  </p>
                  <p className="truncate text-xs text-white/45">{l.autora}</p>
                  <p className="mt-1 text-[11px] text-white/40">
                    {p.total_pages
                      ? `Página ${p.current_page} de ${p.total_pages}`
                      : `${p.percent}% lido`}
                  </p>
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blood-600 to-champagne"
                  style={{ width: `${p.percent}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
