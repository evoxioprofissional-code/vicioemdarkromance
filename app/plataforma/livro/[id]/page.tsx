import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  CalendarDays,
} from "lucide-react";
import BookCover from "@/components/BookCover";
import BookCard from "@/components/BookCard";
import Stars from "@/components/Stars";
import { getLivro, getRelacionados } from "@/lib/queries/books";
import { exigirAcessoConteudo } from "@/lib/queries/account";

export default async function LivroPage({ params }: { params: { id: string } }) {
  await exigirAcessoConteudo();

  const livro = await getLivro(params.id);
  if (!livro) return notFound();

  const sugestoes = await getRelacionados(livro);
  const meta = [
    { icon: FileText, label: "Páginas", valor: String(livro.paginas) },
    { icon: Clock, label: "Leitura", valor: `~${Math.round(livro.paginas / 45)}h` },
    { icon: CalendarDays, label: "Publicado", valor: String(livro.ano) },
  ];

  return (
    <div>
      <Link
        href="/plataforma"
        className="inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Voltar à biblioteca
      </Link>

      {/* ---------- Cabeçalho do livro ---------- */}
      <div className="relative mt-6 overflow-hidden rounded-3xl border border-white/5 p-6 sm:p-10">
        <div
          className="absolute inset-0 -z-10 opacity-70"
          style={{
            background: `radial-gradient(70% 90% at 20% 0%, ${livro.capa.para}44, transparent 60%)`,
          }}
        />
        <div className="grid gap-8 md:grid-cols-[220px_1fr] lg:gap-12">
          {/* capa */}
          <div className="mx-auto w-48 md:mx-0 md:w-full">
            <div className="overflow-hidden rounded-xl shadow-card ring-1 ring-white/10">
              <BookCover livro={livro} />
            </div>
          </div>

          {/* infos */}
          <div>
            <div className="flex flex-wrap gap-2">
              {livro.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-champagne/25 bg-blood-900/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-smoke"
                >
                  {t}
                </span>
              ))}
            </div>

            <h1 className="mt-4 font-display text-4xl font-black leading-tight text-white sm:text-5xl">
              {livro.titulo}
            </h1>
            <p className="mt-2 text-white/55">
              por <span className="text-champagne">{livro.autora}</span>
            </p>

            <div className="mt-3 flex items-center gap-3">
              <Stars nota={livro.nota} showValue />
              <span className="text-sm text-white/40">
                · {livro.capa.selo}
              </span>
            </div>

            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/70">
              {livro.sinopse} A tensão cresce a cada capítulo, entre o que ela
              jura evitar e o que não consegue deixar de desejar. Um enredo de
              alta voltagem, feito para leituras que varam a noite.
            </p>

            {/* metadados */}
            <div className="mt-6 flex flex-wrap gap-6">
              {meta.map((m) => (
                <div key={m.label} className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-champagne">
                    <m.icon size={16} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">
                      {m.valor}
                    </span>
                    <span className="block text-[11px] uppercase tracking-wider text-white/40">
                      {m.label}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            {/* ações */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {livro.temPdf ? (
                <a
                  href={`/plataforma/livro/${livro.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <BookOpen size={16} /> Ler agora
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/45">
                  <BookOpen size={16} /> PDF em breve
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Relacionados ---------- */}
      {sugestoes.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 font-display text-xl font-bold text-white sm:text-2xl">
            Quem leu, também se viciou em
          </h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {sugestoes.map((l) => (
              <BookCard key={l.id} livro={l} href={`/plataforma/livro/${l.id}`} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
