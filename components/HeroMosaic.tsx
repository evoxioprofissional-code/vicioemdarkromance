import type { Livro } from "@/lib/types";
import BookCover from "./BookCover";

/**
 * Mosaico de capas do hero. Recebe os livros por prop (dados reais do banco).
 */
export default function HeroMosaic({ livros }: { livros: Livro[] }) {
  // Distribui os livros em 3 colunas (usa o que houver disponível).
  const cols: Livro[][] = [[], [], []];
  livros.slice(0, 9).forEach((l, i) => cols[i % 3].push(l));

  const Coluna = ({
    itens,
    className = "",
  }: {
    itens: Livro[];
    className?: string;
  }) => (
    <div className={`flex flex-col gap-4 ${className}`}>
      {itens.map((l) => (
        <div
          key={l.id}
          className="w-full overflow-hidden rounded-xl shadow-card ring-1 ring-white/10 transition-transform duration-500 hover:-translate-y-1"
        >
          <BookCover livro={l} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 scale-110">
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-blood-700/40 blur-[90px] animate-pulse-glow" />
        <div className="absolute right-6 top-10 h-40 w-40 rounded-full bg-champagne/15 blur-[70px]" />
      </div>

      <div className="grid grid-cols-3 gap-4 [perspective:1200px]">
        <Coluna itens={cols[0]} className="mt-8 -rotate-2" />
        <Coluna itens={cols[1]} className="-mt-2 rotate-1" />
        <Coluna itens={cols[2]} className="mt-12 rotate-2" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink to-transparent" />
    </div>
  );
}
