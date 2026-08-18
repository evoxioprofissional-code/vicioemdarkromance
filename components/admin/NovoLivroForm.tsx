"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  Check,
  Clock,
  CheckCircle2,
} from "lucide-react";
import BookCover from "@/components/BookCover";
import { categorias, type Categoria, type Livro } from "@/data/livros";

// Paleta de gradientes prontos para a capa
const PALETAS = [
  { de: "#3a0810", para: "#c0303f" },
  { de: "#2a0510", para: "#a11d2e" },
  { de: "#1a0a04", para: "#d9b26a" },
  { de: "#20060a", para: "#7a0f1c" },
  { de: "#0a0810", para: "#8a2f6a" },
  { de: "#12060a", para: "#d94452" },
];

export default function NovoLivroForm() {
  const [titulo, setTitulo] = useState("");
  const [autora, setAutora] = useState("");
  const [selo, setSelo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tags, setTags] = useState<Categoria[]>([]);
  const [paleta, setPaleta] = useState(0);
  const [pdf, setPdf] = useState<string | null>(null);
  const [novoLancamento, setNovoLancamento] = useState(true);
  const [publicado, setPublicado] = useState(false);

  // Livro "fake" só para a pré-visualização da capa
  const preview: Livro = {
    id: "preview",
    titulo: titulo || "Título do livro",
    autora: autora || "Nome da autora",
    tags: tags.length ? tags : ["Dark & Forbidden"],
    sinopse: "",
    paginas: 0,
    ano: 2026,
    nota: 5,
    capa: { ...PALETAS[paleta], selo: selo || "Coleção" },
  };

  const toggleTag = (t: Categoria) =>
    setTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  if (publicado) {
    return (
      <div className="glass-strong mx-auto max-w-xl rounded-2xl p-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="mt-5 font-display text-2xl font-bold text-white">
          Livro publicado!
        </h2>
        <p className="mt-2 text-sm text-white/55">
          <strong className="text-white">{preview.titulo}</strong>{" "}
          {novoLancamento
            ? "entrou na vitrine de Novos Lançamentos e sairá automaticamente em 5 dias."
            : "foi adicionado ao catálogo."}
        </p>
        <p className="mt-1 text-xs text-white/35">
          (Protótipo — nenhum arquivo foi enviado de verdade.)
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/admin/catalogo" className="btn-primary">
            Ver catálogo
          </Link>
          <button onClick={() => setPublicado(false)} className="btn-ghost">
            Adicionar outro
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // mock: não envia para nenhum servidor
        setPublicado(true);
      }}
      className="grid gap-8 lg:grid-cols-[1.6fr_1fr]"
    >
      {/* -------- Coluna do formulário -------- */}
      <div className="space-y-6">
        {/* Upload PDF */}
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-1 font-display text-lg font-bold text-white">
            Arquivo do livro (PDF)
          </h2>
          <p className="mb-4 text-xs text-white/45">
            Faça o upload do PDF que ficará disponível para os assinantes.
          </p>

          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-ink-800/40 px-6 py-9 text-center transition-colors hover:border-champagne/40">
            {pdf ? (
              <>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blood-800/40 text-champagne">
                  <FileText size={20} />
                </span>
                <span className="text-sm font-medium text-white">{pdf}</span>
                <span className="text-xs text-champagne">Trocar arquivo</span>
              </>
            ) : (
              <>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-white/50">
                  <UploadCloud size={22} />
                </span>
                <span className="text-sm text-white/70">
                  Arraste o PDF aqui ou{" "}
                  <span className="text-champagne">clique para selecionar</span>
                </span>
                <span className="text-xs text-white/35">Máx. 50 MB · somente .pdf</span>
              </>
            )}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) =>
                setPdf(e.target.files?.[0]?.name ?? "livro.pdf")
              }
            />
          </label>
        </div>

        {/* Dados do livro */}
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-white">
            Informações
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Título" span2>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex.: Assombrando Adeline"
                className={inputCls}
              />
            </Campo>
            <Campo label="Autora">
              <input
                value={autora}
                onChange={(e) => setAutora(e.target.value)}
                placeholder="Ex.: H. D. Carlton"
                className={inputCls}
              />
            </Campo>
            <Campo label="Coleção / volume (selo da capa)">
              <input
                value={selo}
                onChange={(e) => setSelo(e.target.value)}
                placeholder="Ex.: Gato e Rato · Vol. I"
                className={inputCls}
              />
            </Campo>
            <Campo label="Descrição / sinopse" span2>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={4}
                placeholder="Escreva a sinopse que aparecerá na página do livro…"
                className={`${inputCls} resize-none`}
              />
            </Campo>
          </div>

          {/* Tags */}
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/50">
              Categorias
            </p>
            <div className="flex flex-wrap gap-2">
              {categorias.map((t) => {
                const on = tags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      on
                        ? "border-champagne/40 bg-blood-800/40 text-champagne"
                        : "border-white/10 text-white/55 hover:text-white"
                    }`}
                  >
                    {on && <Check size={12} />}
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Novo lançamento */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                Novo lançamento
              </h2>
              <p className="mt-1 max-w-md text-sm text-white/50">
                Coloca o livro em destaque na vitrine de{" "}
                <strong className="text-white/75">Novos Lançamentos</strong> da home.
                Ele sai automaticamente após <strong className="text-white/75">5 dias</strong>.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={novoLancamento}
              onClick={() => setNovoLancamento((v) => !v)}
              className={`relative mt-1 h-7 w-12 shrink-0 rounded-full transition-colors ${
                novoLancamento ? "bg-gradient-to-r from-blood-700 to-blood-600" : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
                  novoLancamento ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>
          {novoLancamento && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-champagne/25 bg-blood-900/25 px-3 py-1 text-xs font-medium text-champagne">
              <Clock size={12} /> Ficará em destaque por 5 dias a partir da publicação
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary !py-3.5">
            Publicar livro
          </button>
          <Link href="/admin/catalogo" className="btn-ghost !py-3.5">
            Cancelar
          </Link>
        </div>
      </div>

      {/* -------- Coluna da pré-visualização -------- */}
      <div className="lg:sticky lg:top-24 lg:h-fit">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/45">
          Pré-visualização da capa
        </p>
        <div className="mx-auto w-52">
          <div className="overflow-hidden rounded-xl shadow-card ring-1 ring-white/10">
            <BookCover livro={preview} />
          </div>
        </div>

        <p className="mb-2 mt-6 text-xs font-medium uppercase tracking-wider text-white/45">
          Cor da capa
        </p>
        <div className="grid grid-cols-6 gap-2">
          {PALETAS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPaleta(i)}
              aria-label={`Paleta ${i + 1}`}
              className={`h-9 rounded-lg ring-2 transition-all ${
                paleta === i ? "ring-champagne" : "ring-transparent hover:ring-white/20"
              }`}
              style={{ background: `linear-gradient(135deg, ${p.de}, ${p.para})` }}
            />
          ))}
        </div>
        <p className="mt-4 text-xs text-white/35">
          A capa é gerada automaticamente com o título e a autora. Em produção,
          também será possível enviar uma imagem própria.
        </p>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-ink-800/60 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-champagne/40";

function Campo({
  label,
  span2 = false,
  children,
}: {
  label: string;
  span2?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={span2 ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
        {label}
      </label>
      {children}
    </div>
  );
}
