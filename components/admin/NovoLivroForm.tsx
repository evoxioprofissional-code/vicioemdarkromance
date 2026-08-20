"use client";

import { useState } from "react";
import Link from "next/link";
import { UploadCloud, FileText, Check, Clock, AlertCircle } from "lucide-react";
import BookCover from "@/components/BookCover";
import { categorias, type Categoria, type Livro } from "@/lib/types";
import { criarLivro, atualizarLivro } from "@/lib/actions/livros";

const PALETAS = [
  { de: "#3a0810", para: "#c0303f" },
  { de: "#2a0510", para: "#a11d2e" },
  { de: "#1a0a04", para: "#d9b26a" },
  { de: "#20060a", para: "#7a0f1c" },
  { de: "#0a0810", para: "#8a2f6a" },
  { de: "#12060a", para: "#d94452" },
];

export default function NovoLivroForm({
  erro,
  livro,
}: {
  erro?: string;
  livro?: Livro;
}) {
  const editando = !!livro;

  const [titulo, setTitulo] = useState(livro?.titulo ?? "");
  const [autora, setAutora] = useState(livro?.autora ?? "");
  const [selo, setSelo] = useState(livro?.capa.selo ?? "");
  const [descricao, setDescricao] = useState(livro?.sinopse ?? "");
  const [tags, setTags] = useState<Categoria[]>(livro?.tags ?? []);
  const [capaDe, setCapaDe] = useState(livro?.capa.de ?? PALETAS[1].de);
  const [capaPara, setCapaPara] = useState(livro?.capa.para ?? PALETAS[1].para);
  const [pdf, setPdf] = useState<string | null>(livro?.temPdf ? "PDF atual" : null);
  const [novoLancamento, setNovoLancamento] = useState(livro?.novo ?? true);

  const preview: Livro = {
    id: "preview",
    titulo: titulo || "Título do livro",
    autora: autora || "Nome da autora",
    tags: tags.length ? tags : ["Dark & Forbidden"],
    sinopse: "",
    paginas: 0,
    ano: 2026,
    nota: 5,
    capa: { de: capaDe, para: capaPara, selo: selo || "Coleção" },
  };

  const toggleTag = (t: Categoria) =>
    setTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  return (
    <form action={editando ? atualizarLivro : criarLivro} className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      {editando && <input type="hidden" name="slug" value={livro!.id} />}
      <input type="hidden" name="tags" value={tags.join(",")} />
      <input type="hidden" name="capa_de" value={capaDe} />
      <input type="hidden" name="capa_para" value={capaPara} />
      <input type="hidden" name="novo" value={novoLancamento ? "1" : ""} />

      <div className="space-y-6">
        {erro && (
          <div className="flex items-center gap-2 rounded-lg border border-blood-600/40 bg-blood-900/30 px-3 py-2.5 text-sm text-smoke">
            <AlertCircle size={15} /> {erro}
          </div>
        )}

        {/* Upload PDF */}
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-1 font-display text-lg font-bold text-white">
            Arquivo do livro (PDF){editando && " — opcional"}
          </h2>
          <p className="mb-4 text-xs text-white/45">
            {editando
              ? "Envie um PDF só se quiser substituir o atual."
              : "O PDF fica num bucket privado e só é liberado para assinantes ativos."}
          </p>

          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-ink-800/40 px-6 py-9 text-center transition-colors hover:border-champagne/40">
            {pdf ? (
              <>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blood-800/40 text-champagne">
                  <FileText size={20} />
                </span>
                <span className="text-sm font-medium text-white">{pdf}</span>
                <span className="text-xs text-champagne">
                  {editando ? "Trocar PDF" : "Trocar arquivo"}
                </span>
              </>
            ) : (
              <>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-white/50">
                  <UploadCloud size={22} />
                </span>
                <span className="text-sm text-white/70">
                  Arraste o PDF aqui ou <span className="text-champagne">clique para selecionar</span>
                </span>
                <span className="text-xs text-white/35">.pdf</span>
              </>
            )}
            <input
              type="file"
              name="pdf"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setPdf(e.target.files?.[0]?.name ?? (livro?.temPdf ? "PDF atual" : null))}
            />
          </label>
        </div>

        {/* Dados */}
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-white">Informações</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Título" span2>
              <input name="titulo" required value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Assombrando Adeline" className={inputCls} />
            </Campo>
            <Campo label="Autora">
              <input name="autora" required value={autora} onChange={(e) => setAutora(e.target.value)} placeholder="Ex.: H. D. Carlton" className={inputCls} />
            </Campo>
            <Campo label="Páginas">
              <input name="paginas" type="number" min={0} defaultValue={livro?.paginas || ""} placeholder="Ex.: 320" className={inputCls} />
            </Campo>
            <Campo label="Coleção / volume (selo da capa)" span2>
              <input name="selo" value={selo} onChange={(e) => setSelo(e.target.value)} placeholder="Ex.: Gato e Rato · Vol. I" className={inputCls} />
            </Campo>
            <Campo label="Descrição / sinopse" span2>
              <textarea name="sinopse" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={4} placeholder="Escreva a sinopse…" className={`${inputCls} resize-none`} />
            </Campo>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/50">Categorias</p>
            <div className="flex flex-wrap gap-2">
              {categorias.map((t) => {
                const on = tags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      on ? "border-champagne/40 bg-blood-800/40 text-champagne" : "border-white/10 text-white/55 hover:text-white"
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
              <h2 className="font-display text-lg font-bold text-white">Novo lançamento</h2>
              <p className="mt-1 max-w-md text-sm text-white/50">
                Coloca o livro em destaque na vitrine de <strong className="text-white/75">Novos Lançamentos</strong>.
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
              <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${novoLancamento ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary !py-3.5">
            {editando ? "Salvar alterações" : "Publicar livro"}
          </button>
          <Link href="/admin/catalogo" className="btn-ghost !py-3.5">Cancelar</Link>
        </div>
      </div>

      {/* Pré-visualização */}
      <div className="lg:sticky lg:top-24 lg:h-fit">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/45">Pré-visualização da capa</p>
        <div className="mx-auto w-52">
          <div className="overflow-hidden rounded-xl shadow-card ring-1 ring-white/10">
            <BookCover livro={preview} />
          </div>
        </div>

        <p className="mb-2 mt-6 text-xs font-medium uppercase tracking-wider text-white/45">Cor da capa</p>
        <div className="grid grid-cols-6 gap-2">
          {PALETAS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setCapaDe(p.de); setCapaPara(p.para); }}
              aria-label={`Paleta ${i + 1}`}
              className={`h-9 rounded-lg ring-2 transition-all ${capaDe === p.de && capaPara === p.para ? "ring-champagne" : "ring-transparent hover:ring-white/20"}`}
              style={{ background: `linear-gradient(135deg, ${p.de}, ${p.para})` }}
            />
          ))}
        </div>
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
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">{label}</label>
      {children}
    </div>
  );
}
