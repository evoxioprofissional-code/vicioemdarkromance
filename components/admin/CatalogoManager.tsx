"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Pencil, Trash2, FileText, Clock } from "lucide-react";
import BookCover from "@/components/BookCover";
import { diasRestantesLancamento, type Livro } from "@/lib/types";
import { excluirLivro } from "@/lib/actions/livros";

/**
 * Gestão do catálogo. O toggle "Novo lançamento" mostra os dias restantes na
 * vitrine (regra de 5 dias). Recebe os livros por prop (dados reais).
 */
export default function CatalogoManager({ livros }: { livros: Livro[] }) {
  const [busca, setBusca] = useState("");
  // estado local do "novo lançamento" por livro (inicia pela regra dos 5 dias)
  const [novos, setNovos] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      livros.map((l) => [l.id, diasRestantesLancamento(l) > 0])
    )
  );

  const lista = useMemo(
    () =>
      livros.filter(
        (l) =>
          l.titulo.toLowerCase().includes(busca.toLowerCase()) ||
          l.autora.toLowerCase().includes(busca.toLowerCase())
      ),
    [busca]
  );

  return (
    <div className="glass rounded-2xl">
      <div className="flex flex-col gap-3 border-b border-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-white/50">{lista.length} títulos no acervo</span>
        <div className="relative">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar título ou autora…"
            className="w-full rounded-full border border-white/10 bg-ink-800/60 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-champagne/40 sm:w-64"
          />
        </div>
      </div>

      <ul className="divide-y divide-white/5">
        {lista.map((l) => {
          const dias = diasRestantesLancamento(l);
          const ativo = novos[l.id];
          return (
            <li key={l.id} className="flex items-center gap-4 p-4">
              <div className="w-11 shrink-0 overflow-hidden rounded-md ring-1 ring-white/10">
                <BookCover livro={l} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base font-semibold text-white">
                  {l.titulo}
                </p>
                <p className="truncate text-xs text-white/45">
                  {l.autora} · {l.tags.join(", ")}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] text-white/40">
                    <FileText size={11} /> {l.paginas} pág.
                  </span>
                  {ativo ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-champagne/30 bg-blood-900/30 px-2 py-0.5 text-[11px] font-semibold text-champagne">
                      <Clock size={11} />
                      {dias > 0 ? `Novo lançamento · sai em ${dias} ${dias === 1 ? "dia" : "dias"}` : "Novo lançamento"}
                    </span>
                  ) : (
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-white/45">
                      Publicado
                    </span>
                  )}
                </div>
              </div>

              {/* toggle novo lançamento */}
              <label className="hidden cursor-pointer items-center gap-2 sm:flex">
                <span className="text-xs text-white/45">Novo</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={ativo}
                  onClick={() =>
                    setNovos((s) => ({ ...s, [l.id]: !s[l.id] }))
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    ativo ? "bg-gradient-to-r from-blood-700 to-blood-600" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      ativo ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </label>

              <div className="flex gap-1">
                <Link
                  href={`/admin/catalogo/${l.id}/editar`}
                  className="grid h-9 w-9 place-items-center rounded-lg text-white/45 hover:bg-white/5 hover:text-champagne"
                  aria-label="Editar"
                >
                  <Pencil size={15} />
                </Link>
                <form
                  action={excluirLivro}
                  onSubmit={(e) => {
                    if (!confirm(`Excluir "${l.titulo}"? Essa ação não pode ser desfeita.`)) {
                      e.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="slug" value={l.id} />
                  <button
                    type="submit"
                    className="grid h-9 w-9 place-items-center rounded-lg text-white/45 hover:bg-white/5 hover:text-blood-500"
                    aria-label="Excluir"
                  >
                    <Trash2 size={15} />
                  </button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
