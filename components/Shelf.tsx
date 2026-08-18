"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Livro } from "@/lib/types";
import BookCard from "./BookCard";

/** Prateleira horizontal com scroll e setas (categoria da plataforma). */
export default function Shelf({
  titulo,
  livros,
}: {
  titulo: string;
  livros: Livro[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  if (livros.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
          {titulo}
        </h2>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={() => scroll(-1)}
            className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-white/10 text-white/60 transition-colors hover:text-white hover:ring-champagne/40"
            aria-label="Anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-white/10 text-white/60 transition-colors hover:text-white hover:ring-champagne/40"
            aria-label="Próximo"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto scroll-smooth px-1 pb-2"
      >
        {livros.map((l) => (
          <div key={l.id} className="w-[150px] shrink-0 sm:w-[170px]">
            <BookCard livro={l} href={`/plataforma/livro/${l.id}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
