import Link from "next/link";
import { Play, Plus, LibraryBig, BookMarked } from "lucide-react";
import Shelf from "@/components/Shelf";
import BookCard from "@/components/BookCard";
import Stars from "@/components/Stars";
import {
  livros,
  lancamentos,
  maisLidos,
  livrosPorCategoria,
} from "@/data/livros";

// Livro em destaque no banner (o primeiro marcado como destaque)
const destaque = livros.find((l) => l.destaque) ?? livros[0];

export default function PlataformaHome() {
  return (
    <div>
      {/* ---------- Banner de destaque ---------- */}
      <section className="relative mb-12 overflow-hidden rounded-3xl border border-white/5">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(90% 120% at 15% 0%, ${destaque.capa.para}55, ${destaque.capa.de} 55%), linear-gradient(120deg, #120608, #0a0607)`,
          }}
        />
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blood-700/30 blur-[80px]" />

        <div className="relative grid items-center gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            <span className="eyebrow">
              <BookMarked size={13} /> Em destaque esta semana
            </span>
            <h1 className="mt-4 font-display text-4xl font-black leading-tight text-white sm:text-5xl">
              {destaque.titulo}
            </h1>
            <p className="mt-2 text-sm uppercase tracking-widest text-white/50">
              {destaque.autora} · {destaque.tags.join(" · ")}
            </p>
            <div className="mt-3">
              <Stars nota={destaque.nota} showValue />
            </div>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/70">
              {destaque.sinopse}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/plataforma/livro/${destaque.id}`}
                className="btn-primary"
              >
                <Play size={16} /> Ler agora
              </Link>
              <button className="btn-ghost">
                <Plus size={16} /> Minha lista
              </button>
            </div>
          </div>

          <div className="hidden w-52 shrink-0 lg:block">
            <BookCard livro={destaque} href={`/plataforma/livro/${destaque.id}`} compact />
          </div>
        </div>
      </section>

      {/* ---------- Prateleiras por categoria ---------- */}
      <Shelf titulo="Lançamentos do mês" livros={lancamentos()} />
      <Shelf titulo="Mais lidos" livros={maisLidos()} />
      <Shelf titulo="Máfia Romance" livros={livrosPorCategoria("Máfia Romance")} />
      <Shelf
        titulo="Inimigos para Amantes"
        livros={livrosPorCategoria("Inimigos para Amantes")}
      />
      <Shelf titulo="Dark & Forbidden" livros={livrosPorCategoria("Dark & Forbidden")} />

      {/* ---------- Biblioteca completa ---------- */}
      <section className="mt-6">
        <div className="mb-5 flex items-center gap-2">
          <LibraryBig size={18} className="text-champagne" />
          <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
            Biblioteca completa
          </h2>
          <span className="text-sm text-white/40">· {livros.length} títulos</span>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {livros.map((l) => (
            <BookCard key={l.id} livro={l} href={`/plataforma/livro/${l.id}`} />
          ))}
        </div>
      </section>
    </div>
  );
}
