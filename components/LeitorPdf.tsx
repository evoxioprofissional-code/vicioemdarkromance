"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Minus,
  Plus,
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  Highlighter,
  StickyNote,
  X,
  Trash2,
  ListChecks,
} from "lucide-react";
import { salvarProgresso } from "@/lib/actions/progresso";
import {
  criarGrifo,
  alternarMarcador,
  criarNota,
  excluirAnotacao,
} from "@/lib/actions/anotacoes";
import type { Anotacao, RetanguloNorm } from "@/lib/types";

// Worker do pdf.js servido de /public (copiado de pdfjs-dist no setup).
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// Paleta de cores dos grifos.
const CORES: { id: string; bg: string; dot: string }[] = [
  { id: "amarelo", bg: "rgba(240,200,80,0.45)", dot: "#f0c850" },
  { id: "rosa", bg: "rgba(225,90,140,0.42)", dot: "#e15a8c" },
  { id: "verde", bg: "rgba(90,200,140,0.40)", dot: "#5ac88c" },
  { id: "azul", bg: "rgba(90,150,230,0.40)", dot: "#5a96e6" },
];
const corBg = (id: string) => CORES.find((c) => c.id === id)?.bg ?? CORES[0].bg;
const corDot = (id: string) => CORES.find((c) => c.id === id)?.dot ?? CORES[0].dot;

interface Props {
  slug: string;
  titulo: string;
  fileUrl: string;
  startPage: number;
  anotacoesIniciais: Anotacao[];
}

interface SelecaoAtiva {
  top: number;
  left: number;
  page: number;
  rects: RetanguloNorm[];
  texto: string;
}

export default function LeitorPdf({
  slug,
  titulo,
  fileUrl,
  startPage,
  anotacoesIniciais,
}: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState<number>(Math.max(1, startPage || 1));
  const [zoom, setZoom] = useState<number>(1);
  const [width, setWidth] = useState<number>(0);
  const [erro, setErro] = useState<string | null>(null);

  const [anotacoes, setAnotacoes] = useState<Anotacao[]>(anotacoesIniciais);
  const [selecao, setSelecao] = useState<SelecaoAtiva | null>(null);
  const [painelAberto, setPainelAberto] = useState(false);
  const [notaAberta, setNotaAberta] = useState<{
    page: number;
    texto?: string;
    rects?: RetanguloNorm[];
  } | null>(null);
  const [notaTexto, setNotaTexto] = useState("");
  const [mostrarRetomada, setMostrarRetomada] = useState(
    (startPage || 1) > 1
  );

  const wrapRef = useRef<HTMLDivElement>(null);
  const pageBoxRef = useRef<HTMLDivElement>(null);
  const salvarTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fileConfig = useMemo(() => ({ url: fileUrl }), [fileUrl]);
  const options = useMemo(() => ({}), []);

  // ---- Derivados por página ----
  const destaquesDaPagina = useMemo(
    () =>
      anotacoes.filter(
        (a) => a.page === page && a.rects?.length && (a.tipo === "grifo" || a.tipo === "nota")
      ),
    [anotacoes, page]
  );
  const paginaMarcada = useMemo(
    () => anotacoes.some((a) => a.tipo === "marcador" && a.page === page),
    [anotacoes, page]
  );
  const marcadores = useMemo(
    () => anotacoes.filter((a) => a.tipo === "marcador").sort((a, b) => a.page - b.page),
    [anotacoes]
  );
  const grifos = useMemo(
    () => anotacoes.filter((a) => a.tipo === "grifo"),
    [anotacoes]
  );
  const notas = useMemo(
    () => anotacoes.filter((a) => a.tipo === "nota"),
    [anotacoes]
  );

  // ---- Largura responsiva ----
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const medir = () => setWidth(el.clientWidth);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ---- Salvar progresso (debounce) ----
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

  useEffect(() => {
    const onLeave = () => {
      if (numPages) salvarProgresso(slug, page, numPages).catch(() => {});
    };
    window.addEventListener("pagehide", onLeave);
    return () => window.removeEventListener("pagehide", onLeave);
  }, [page, numPages, slug]);

  // Esconde o aviso "voltou para a página X" depois de um tempo.
  useEffect(() => {
    if (!mostrarRetomada) return;
    const t = setTimeout(() => setMostrarRetomada(false), 4500);
    return () => clearTimeout(t);
  }, [mostrarRetomada]);

  // ---- Navegação ----
  const irPara = useCallback(
    (p: number) => {
      setSelecao(null);
      setPage((atual) => {
        const max = numPages || atual;
        return Math.min(Math.max(1, p), max);
      });
    },
    [numPages]
  );
  const anterior = useCallback(() => irPara(page - 1), [irPara, page]);
  const proxima = useCallback(() => irPara(page + 1), [irPara, page]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (notaAberta) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") proxima();
      if (e.key === "ArrowLeft" || e.key === "PageUp") anterior();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [anterior, proxima, notaAberta]);

  function onLoad({ numPages: n }: { numPages: number }) {
    setNumPages(n);
    setPage((atual) => Math.min(Math.max(1, atual), n));
  }

  // ---- Captura de seleção de texto (grifo/nota) ----
  const capturarSelecao = useCallback(() => {
    const box = pageBoxRef.current;
    if (!box) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      setSelecao(null);
      return;
    }
    const range = sel.getRangeAt(0);
    if (!box.contains(range.commonAncestorContainer)) {
      setSelecao(null);
      return;
    }
    const b = box.getBoundingClientRect();
    const clientRects = Array.from(range.getClientRects()).filter(
      (r) => r.width > 1 && r.height > 4
    );
    if (!clientRects.length) {
      setSelecao(null);
      return;
    }
    const rects: RetanguloNorm[] = clientRects.map((r) => ({
      x: (r.left - b.left) / b.width,
      y: (r.top - b.top) / b.height,
      w: r.width / b.width,
      h: r.height / b.height,
    }));
    const primeiro = clientRects[0];
    setSelecao({
      top: primeiro.top,
      left: primeiro.left + primeiro.width / 2,
      page,
      rects,
      texto: sel.toString(),
    });
  }, [page]);

  async function grifar(cor: string) {
    if (!selecao) return;
    const nova = await criarGrifo(slug, selecao.page, selecao.rects, selecao.texto, cor);
    if (nova) setAnotacoes((a) => [...a, nova]);
    window.getSelection()?.removeAllRanges();
    setSelecao(null);
  }

  function abrirNotaDaSelecao() {
    if (!selecao) return;
    setNotaAberta({ page: selecao.page, texto: selecao.texto, rects: selecao.rects });
    setNotaTexto("");
    setSelecao(null);
  }

  function abrirNotaDaPagina() {
    setNotaAberta({ page });
    setNotaTexto("");
    setPainelAberto(false);
  }

  async function salvarNota() {
    if (!notaAberta || !notaTexto.trim()) return;
    const nova = await criarNota(
      slug,
      notaAberta.page,
      notaTexto,
      notaAberta.texto,
      notaAberta.rects
    );
    if (nova) setAnotacoes((a) => [...a, nova]);
    window.getSelection()?.removeAllRanges();
    setNotaAberta(null);
    setNotaTexto("");
  }

  async function marcarPagina() {
    const { marcado } = await alternarMarcador(slug, page);
    setAnotacoes((a) => {
      const semDaPagina = a.filter(
        (x) => !(x.tipo === "marcador" && x.page === page)
      );
      if (!marcado) return semDaPagina;
      return [
        ...semDaPagina,
        {
          id: `tmp-${Date.now()}`,
          page,
          tipo: "marcador",
          cor: "amarelo",
          texto: null,
          nota: null,
          rects: null,
          created_at: new Date().toISOString(),
        },
      ];
    });
  }

  async function apagar(id: string) {
    setAnotacoes((a) => a.filter((x) => x.id !== id));
    await excluirAnotacao(id);
  }

  const larguraPagina = width ? Math.min(width, 900) * zoom : undefined;
  const totalAnotacoes = anotacoes.length;

  return (
    <div>
      {/* ---------- Barra superior ---------- */}
      <div className="sticky top-0 z-30 -mx-4 mb-4 flex items-center gap-2 border-b border-white/10 bg-ink-900/90 px-3 py-3 backdrop-blur sm:-mx-6 sm:gap-3 sm:px-6">
        <Link
          href={`/plataforma/livro/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} /> <span className="hidden sm:inline">Voltar</span>
        </Link>

        <h1 className="min-w-0 flex-1 truncate text-center font-display text-sm font-semibold text-white sm:text-base">
          {titulo}
        </h1>

        <button
          onClick={marcarPagina}
          className={`grid h-9 w-9 place-items-center rounded-lg ring-1 transition-colors ${
            paginaMarcada
              ? "bg-champagne/15 text-champagne ring-champagne/40"
              : "text-white/70 ring-white/10 hover:text-white hover:ring-champagne/40"
          }`}
          aria-label={paginaMarcada ? "Remover marcador" : "Marcar página"}
          title={paginaMarcada ? "Remover marcador" : "Marcar página"}
        >
          {paginaMarcada ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>

        <button
          onClick={() => setPainelAberto(true)}
          className="relative grid h-9 w-9 place-items-center rounded-lg text-white/70 ring-1 ring-white/10 transition-colors hover:text-white hover:ring-champagne/40"
          aria-label="Minhas anotações"
          title="Minhas anotações"
        >
          <ListChecks size={18} />
          {totalAnotacoes > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-blood-600 px-1 text-[10px] font-bold text-white">
              {totalAnotacoes}
            </span>
          )}
        </button>

        <div className="hidden items-center gap-1 md:flex">
          <button
            onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.15).toFixed(2)))}
            className="grid h-8 w-8 place-items-center rounded-lg text-white/70 ring-1 ring-white/10 hover:text-white hover:ring-champagne/40"
            aria-label="Diminuir"
          >
            <Minus size={15} />
          </button>
          <span className="w-11 text-center text-xs text-white/50">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(2, +(z + 0.15).toFixed(2)))}
            className="grid h-8 w-8 place-items-center rounded-lg text-white/70 ring-1 ring-white/10 hover:text-white hover:ring-champagne/40"
            aria-label="Aumentar"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* ---------- Aviso "voltou para onde parou" ---------- */}
      {mostrarRetomada && (
        <div className="mx-auto mb-4 flex max-w-[900px] items-center gap-2 rounded-xl border border-champagne/25 bg-blood-900/25 px-4 py-2.5 text-sm text-champagne">
          <BookmarkCheck size={16} />
          Você voltou para onde parou — página {page}.
        </div>
      )}

      {/* ---------- Área de leitura ---------- */}
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
              <div
                ref={pageBoxRef}
                className="relative mx-auto w-fit overflow-hidden rounded-xl shadow-card ring-1 ring-white/10"
                onMouseUp={capturarSelecao}
                onTouchEnd={capturarSelecao}
              >
                <Page
                  pageNumber={page}
                  width={larguraPagina}
                  renderTextLayer
                  renderAnnotationLayer={false}
                  loading={
                    <div className="flex items-center justify-center py-24 text-white/40">
                      <Loader2 className="animate-spin" size={18} />
                    </div>
                  }
                />
                {/* Overlay dos grifos/notas desta página */}
                <div className="pointer-events-none absolute inset-0">
                  {destaquesDaPagina.map((a) =>
                    (a.rects ?? []).map((r, i) => (
                      <div
                        key={`${a.id}-${i}`}
                        style={{
                          position: "absolute",
                          left: `${r.x * 100}%`,
                          top: `${r.y * 100}%`,
                          width: `${r.w * 100}%`,
                          height: `${r.h * 100}%`,
                          background: corBg(a.cor),
                          borderRadius: 2,
                          mixBlendMode: "multiply",
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </Document>
        )}
      </div>

      {/* ---------- Barra de seleção (grifar / nota) ---------- */}
      {selecao && (
        <div
          className="fixed z-40 -translate-x-1/2 -translate-y-full"
          style={{ top: selecao.top - 8, left: Math.min(Math.max(selecao.left, 90), (typeof window !== "undefined" ? window.innerWidth : 400) - 90) }}
        >
          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-ink-800 px-2 py-1.5 shadow-glow">
            {CORES.map((c) => (
              <button
                key={c.id}
                onClick={() => grifar(c.id)}
                className="h-6 w-6 rounded-full ring-1 ring-white/20 transition-transform hover:scale-110"
                style={{ background: c.dot }}
                aria-label={`Grifar ${c.id}`}
                title={`Grifar ${c.id}`}
              />
            ))}
            <span className="mx-0.5 h-5 w-px bg-white/15" />
            <button
              onClick={abrirNotaDaSelecao}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs text-white/80 hover:text-white"
              title="Adicionar nota ao trecho"
            >
              <StickyNote size={14} /> Nota
            </button>
          </div>
        </div>
      )}

      {/* ---------- Navegação inferior + progresso ---------- */}
      {numPages > 0 && !erro && (
        <div className="sticky bottom-0 z-30 -mx-4 mt-5 border-t border-white/10 bg-ink-900/90 backdrop-blur sm:-mx-6">
          <div className="h-1 w-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-blood-600 to-champagne transition-all"
              style={{ width: `${Math.round((page / numPages) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-center gap-4 px-4 py-3">
            <button
              onClick={anterior}
              disabled={page <= 1}
              className="grid h-10 w-10 place-items-center rounded-full text-white/70 ring-1 ring-white/10 transition-colors hover:text-white hover:ring-champagne/40 disabled:opacity-30 disabled:hover:ring-white/10"
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
              className="grid h-10 w-10 place-items-center rounded-full text-white/70 ring-1 ring-white/10 transition-colors hover:text-white hover:ring-champagne/40 disabled:opacity-30 disabled:hover:ring-white/10"
              aria-label="Próxima página"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ---------- Modal de nota ---------- */}
      {notaAberta && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
          onClick={() => setNotaAberta(null)}
        >
          <div
            className="glass-strong w-full max-w-lg rounded-t-2xl p-5 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="inline-flex items-center gap-2 font-display text-lg font-bold text-white">
                <StickyNote size={18} className="text-champagne" /> Nota · página{" "}
                {notaAberta.page}
              </h3>
              <button
                onClick={() => setNotaAberta(null)}
                className="text-white/50 hover:text-white"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>
            {notaAberta.texto && (
              <p className="mt-3 border-l-2 border-champagne/40 pl-3 text-sm italic text-white/60">
                “{notaAberta.texto.slice(0, 240)}”
              </p>
            )}
            <textarea
              autoFocus
              value={notaTexto}
              onChange={(e) => setNotaTexto(e.target.value)}
              placeholder="Escreva sua nota…"
              rows={4}
              className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-champagne/40"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setNotaAberta(null)} className="btn-ghost !py-2">
                Cancelar
              </button>
              <button
                onClick={salvarNota}
                disabled={!notaTexto.trim()}
                className="btn-primary !py-2 disabled:opacity-40"
              >
                Salvar nota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Painel de anotações ---------- */}
      {painelAberto && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/60"
          onClick={() => setPainelAberto(false)}
        >
          <aside
            className="h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-ink-900 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-white">
                Minhas anotações
              </h2>
              <button
                onClick={() => setPainelAberto(false)}
                className="text-white/50 hover:text-white"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            <button
              onClick={abrirNotaDaPagina}
              className="btn-ghost mt-4 w-full justify-center !py-2 text-sm"
            >
              <StickyNote size={15} /> Nova nota nesta página
            </button>

            {totalAnotacoes === 0 && (
              <p className="mt-8 text-center text-sm text-white/45">
                Selecione um trecho para grifar, ou marque páginas e crie notas.
                Tudo fica salvo aqui.
              </p>
            )}

            {/* Marcadores */}
            {marcadores.length > 0 && (
              <Secao icon={<Bookmark size={15} />} titulo="Marcadores">
                {marcadores.map((m) => (
                  <ItemAnotacao
                    key={m.id}
                    onIr={() => {
                      irPara(m.page);
                      setPainelAberto(false);
                    }}
                    onApagar={() => apagar(m.id)}
                  >
                    <span className="text-sm text-white/80">Página {m.page}</span>
                  </ItemAnotacao>
                ))}
              </Secao>
            )}

            {/* Grifos */}
            {grifos.length > 0 && (
              <Secao icon={<Highlighter size={15} />} titulo="Grifos">
                {grifos.map((g) => (
                  <ItemAnotacao
                    key={g.id}
                    onIr={() => {
                      irPara(g.page);
                      setPainelAberto(false);
                    }}
                    onApagar={() => apagar(g.id)}
                  >
                    <span
                      className="mt-0.5 h-3 w-3 shrink-0 rounded-full ring-1 ring-white/20"
                      style={{ background: corDot(g.cor) }}
                    />
                    <span className="min-w-0">
                      <span className="line-clamp-2 text-sm text-white/80">
                        {g.texto || "(trecho grifado)"}
                      </span>
                      <span className="text-xs text-white/40">página {g.page}</span>
                    </span>
                  </ItemAnotacao>
                ))}
              </Secao>
            )}

            {/* Notas */}
            {notas.length > 0 && (
              <Secao icon={<StickyNote size={15} />} titulo="Notas">
                {notas.map((n) => (
                  <ItemAnotacao
                    key={n.id}
                    onIr={() => {
                      irPara(n.page);
                      setPainelAberto(false);
                    }}
                    onApagar={() => apagar(n.id)}
                  >
                    <span className="min-w-0">
                      <span className="line-clamp-3 text-sm text-white/85">{n.nota}</span>
                      {n.texto && (
                        <span className="line-clamp-1 text-xs italic text-white/40">
                          “{n.texto}”
                        </span>
                      )}
                      <span className="text-xs text-white/40">página {n.page}</span>
                    </span>
                  </ItemAnotacao>
                ))}
              </Secao>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

function Secao({
  icon,
  titulo,
  children,
}: {
  icon: ReactNode;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-6">
      <h3 className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-champagne">
        {icon} {titulo}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function ItemAnotacao({
  children,
  onIr,
  onApagar,
}: {
  children: ReactNode;
  onIr: () => void;
  onApagar: () => void;
}) {
  return (
    <div className="group flex items-start gap-2 rounded-xl border border-white/5 bg-ink-800/40 p-3">
      <button onClick={onIr} className="flex min-w-0 flex-1 items-start gap-2 text-left">
        {children}
      </button>
      <button
        onClick={onApagar}
        className="shrink-0 text-white/30 transition-colors hover:text-blood-500"
        aria-label="Excluir"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
