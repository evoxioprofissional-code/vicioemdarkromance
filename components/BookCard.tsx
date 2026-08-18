import Link from "next/link";
import type { Livro } from "@/data/livros";
import BookCover from "./BookCover";
import Stars from "./Stars";

/**
 * Card de livro com hover elegante (elevação + glow).
 * `href` opcional: se informado, o card inteiro vira link.
 */
export default function BookCard({
  livro,
  href,
  compact = false,
}: {
  livro: Livro;
  href?: string;
  compact?: boolean;
}) {
  const inner = (
    <div className="relative">
      {/* glow que aparece no hover */}
      <div className="pointer-events-none absolute -inset-2 rounded-2xl bg-blood-700/0 blur-xl transition-all duration-500 group-hover:bg-blood-700/25" />

      <div className="relative transition-transform duration-500 will-change-transform group-hover:-translate-y-1.5">
        <div className="overflow-hidden rounded-[10px] shadow-card ring-1 ring-white/5 transition-shadow duration-500 group-hover:shadow-card-hover">
          <BookCover livro={livro} />
        </div>

        {/* selo NOVO */}
        {livro.novo && (
          <span className="absolute left-2 top-2 rounded-full border border-champagne/40 bg-ink/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-champagne backdrop-blur">
            Novo
          </span>
        )}
      </div>

      {!compact && (
        <div className="mt-3 px-0.5">
          <div className="flex items-center gap-2">
            <span className="truncate text-[10px] font-medium uppercase tracking-wider text-blood-500">
              {livro.tags[0]}
            </span>
          </div>
          <h3 className="mt-0.5 truncate font-display text-base font-semibold text-white">
            {livro.titulo}
          </h3>
          <div className="mt-1 flex items-center justify-between">
            <span className="truncate text-xs text-white/50">
              {livro.autora}
            </span>
            <Stars nota={livro.nota} size={12} />
          </div>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block">
        {inner}
      </Link>
    );
  }
  return <div className="group block">{inner}</div>;
}
