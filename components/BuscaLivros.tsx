"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

/**
 * Barra de busca de livros (topbar da plataforma). Ao enviar, navega para a
 * página de resultados /plataforma/buscar?q=... — funciona no PC e no mobile.
 */
export default function BuscaLivros({ inicial = "" }: { inicial?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(inicial);

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    const termo = q.trim();
    if (termo) router.push(`/plataforma/buscar?q=${encodeURIComponent(termo)}`);
  }

  return (
    <form onSubmit={buscar} className="relative w-full max-w-xl" role="search">
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
      />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por título, autora…"
        aria-label="Buscar livros"
        className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-9 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-champagne/40 focus:bg-white/10 [&::-webkit-search-cancel-button]:hidden"
      />
      {q && (
        <button
          type="button"
          onClick={() => setQ("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
          aria-label="Limpar"
        >
          <X size={15} />
        </button>
      )}
    </form>
  );
}
