"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Minus,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { salvarProgresso } from "@/lib/actions/progresso";

// Worker do pdf.js servido de /public (copiado de pdfjs-dist no setup).
// Evita que o webpack do Next tente parsear o .mjs do worker.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface Props {
  slug: string;
  titulo: string;
  fileUrl: string;
  startPage: number;
}

export default function LeitorPdf({ slug, titulo, fileUrl, startPage }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState<number>(Math.max(1, startPage || 1));
  const [zoom, setZoom] = useState<number>(1);
  const [width, setWidth] = useState<number>(0);
  const [erro, setErro] = useState<string | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const salvarTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Nunca recriar o objeto de opções (evita recarregar o documento à toa).
  const fileConfig = useMemo(() => ({ url: fileUrl }), [fileUrl]);
  const options = useMemo(() => ({}), []);

  // Largura responsiva: acompanha o container.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const medir = () => setWidth(el.clientWidth);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Salva o progresso (com debounce) sempre que a página muda.
  useEffect(() => {
    if (!numPages) return;
    if (salvarTimer.current) clearTimeout(salvarTimer.current);
    salvarTimer.current = setTimeout(() => {
      salvarProgresso(slug, page, numPages).catch(() => {});
    }, 800);
    return () => {
      if (salvarTimer.current) clearTimeout(salvarTimer.current);
    };
  }, [page, numPages, slug]);

  // Garante um último save ao fechar/atualizar a aba.
  useEffect(() => {
    const onLeave = () => {
      if (numPages) salvarProgresso(slug, page, numPages).catch(() => {});
    };
    window.addEventListener("pagehide", onLeave);
    return () => window.removeEventListener("pagehide", onLeave);
  }, [page, numPages, slug]);

  const irPara = useCallback(
    (p: number) => {
      setPage((atual) => {
        const max = numPages || atual;
        const alvo = Math.min(Math.max(1, p), max);
        return alvo;
      });
    },
    [numPages]
  );

  const anterior = useCallback(() => irPara(page - 1), [irPara, page]);
  const proxima = useCallback(() => irPara(page + 1), [irPara, page]);

  // Setas do teclado navegam entre páginas.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") proxima();
      if (e.key === "ArrowLeft" || e.key === "PageUp") anterior();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [anterior, proxima]);

  function onLoad({ numPages: n }: { numPages: number }) {
    setNumPages(n);
    // Retoma na página salva, sem ultrapassar o total real do arquivo.
    setPage((atual) => Math.min(Math.max(1, atual), n));
  }

  const larguraPagina = width ? Math.min(width, 900) * zoom : undefined;

  return (
    <div
      className="select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Barra superior */}
      <div className="sticky top-0 z-20 -mx-4 mb-4 flex items-center gap-3 border-b border-white/10 bg-ink-900/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <Link
          href={`/plataforma/livro/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} /> <span className="hidden sm:inline">Voltar</span>
        </Link>

        <h1 className="min-w-0 flex-1 truncate text-center font-display text-sm font-semibold text-white sm:text-base">
          {titulo}
        </h1>

        {/* Zoom */}
        <div className="hidden items-center gap-1 sm:flex">
          <button
            onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.15).toFixed(2)))}
            className="grid h-8 w-8 place-items-center rounded-lg ring-1 ring-white/10 text-white/70 hover:text-white hover:ring-champagne/40"
            aria-label="Diminuir"
          >
            <Minus size={15} />
          </button>
          <span className="w-12 text-center text-xs text-white/50">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(2, +(z + 0.15).toFixed(2)))}
            className="grid h-8 w-8 place-items-center rounded-lg ring-1 ring-white/10 text-white/70 hover:text-white hover:ring-champagne/40"
            aria-label="Aumentar"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Área de leitura */}
      <div ref={wrapRef} className="mx-auto max-w-[900px]">
        {erro ? (
          <div className="glass flex flex-col items-center gap-3 rounded-2xl p-10 text-center">
            <AlertTriangle className="text-champagne" />
            <p className="text-white/70">{erro}</p>
            <Link href={`/plataforma/livro/${slug}`} className="btn-ghost mt-2 !py-2">
              Voltar ao livro
            </Link>
          </div>
        ) : (
          <Document
            file={fileConfig}
            options={options}
            onLoadSuccess={onLoad}
            onLoadError={() =>
              setErro("Não foi possível carregar o livro. Tente novamente.")
            }
            loading={
              <div className="flex items-center justify-center gap-2 py-24 text-white/50">
                <Loader2 className="animate-spin" size={18} /> Carregando livro…
              </div>
            }
            error={
              <div className="py-24 text-center text-white/50">
                Falha ao carregar o PDF.
              </div>
            }
          >
            {numPages > 0 && (
              <div className="overflow-hidden rounded-xl shadow-card ring-1 ring-white/10">
                <Page
                  pageNumber={page}
                  width={larguraPagina}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={
                    <div className="flex items-center justify-center py-24 text-white/40">
                      <Loader2 className="animate-spin" size={18} />
                    </div>
                  }
                />
              </div>
            )}
          </Document>
        )}
      </div>

      {/* Navegação inferior */}
      {numPages > 0 && !erro && (
        <div className="sticky bottom-0 z-20 -mx-4 mt-5 flex items-center justify-center gap-4 border-t border-white/10 bg-ink-900/85 px-4 py-3 backdrop-blur sm:-mx-6">
          <button
            onClick={anterior}
            disabled={page <= 1}
            className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/10 text-white/70 transition-colors hover:text-white hover:ring-champagne/40 disabled:opacity-30 disabled:hover:ring-white/10"
            aria-label="Página anterior"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="number"
              min={1}
              max={numPages}
              value={page}
              onChange={(e) => irPara(Number(e.target.value))}
              className="w-14 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-center text-white outline-none focus:border-champagne/40"
            />
            <span className="text-white/40">de {numPages}</span>
          </div>

          <button
            onClick={proxima}
            disabled={page >= numPages}
            className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/10 text-white/70 transition-colors hover:text-white hover:ring-champagne/40 disabled:opacity-30 disabled:hover:ring-white/10"
            aria-label="Próxima página"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
