import type { Livro } from "@/lib/types";

/**
 * Capa "premium" gerada 100% via CSS — sem imagens externas.
 * Combina um gradiente vinho, brilho, vinheta, filete dourado e
 * a tipografia do título, imitando uma capa de dark romance.
 */
export default function BookCover({
  livro,
  className = "",
}: {
  livro: Livro;
  className?: string;
}) {
  return (
    <div
      className={`group relative aspect-[2/3] w-full overflow-hidden rounded-[10px] ${className}`}
      style={{
        background: `radial-gradient(120% 90% at 50% -10%, ${livro.capa.para}55 0%, ${livro.capa.de} 60%), linear-gradient(160deg, ${livro.capa.de} 0%, #060304 100%)`,
      }}
    >
      {/* brilho difuso atrás do título */}
      <div
        className="pointer-events-none absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-90"
        style={{ background: `${livro.capa.para}`, opacity: 0.35 }}
      />
      {/* vinheta escura nas bordas */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_20%,transparent_40%,rgba(0,0,0,0.75)_100%)]" />
      {/* filete dourado interno */}
      <div className="pointer-events-none absolute inset-[6px] rounded-[7px] ring-1 ring-champagne/25" />

      {/* conteúdo tipográfico */}
      <div className="relative flex h-full flex-col justify-between p-4">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-semibold uppercase tracking-[0.22em] text-champagne/70">
            Vício
          </span>
          <span className="text-[8px] uppercase tracking-[0.18em] text-white/45">
            +18
          </span>
        </div>

        <div className="text-center">
          <p className="mb-2 text-[8px] uppercase tracking-[0.28em] text-white/50">
            {livro.capa.selo}
          </p>
          <div className="mx-auto mb-2 h-px w-8 bg-champagne/40" />
          <h3 className="font-display text-lg font-bold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] sm:text-xl">
            {livro.titulo}
          </h3>
        </div>

        <p className="text-center text-[9px] font-medium uppercase tracking-[0.24em] text-white/60">
          {livro.autora}
        </p>
      </div>

      {/* reflexo/brilho ao passar o mouse */}
      <div className="pointer-events-none absolute inset-0 translate-y-full bg-gradient-to-t from-transparent via-white/5 to-white/10 transition-transform duration-700 group-hover:translate-y-0" />
    </div>
  );
}
