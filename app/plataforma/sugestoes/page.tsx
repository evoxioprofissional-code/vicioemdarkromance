import Link from "next/link";
import {
  ArrowLeft,
  Lightbulb,
  Send,
  Trash2,
  CheckCircle2,
  AlertCircle,
  BookHeart,
} from "lucide-react";
import { getMinhasSugestoes, type Sugestao } from "@/lib/queries/account";
import { sugerirLivro, apagarSugestao } from "@/lib/actions/sugestoes";

const STATUS: Record<Sugestao["status"], { label: string; cls: string }> = {
  pendente: { label: "Recebida", cls: "border-white/15 bg-white/5 text-white/60" },
  avaliando: { label: "Em avaliação", cls: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
  adicionado: { label: "Adicionado ✨", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
  recusado: { label: "Não desta vez", cls: "border-blood-600/40 bg-blood-900/30 text-blood-500" },
};

const inputCls =
  "w-full rounded-xl border border-white/10 bg-ink-800/60 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-champagne/40";

export default async function SugestoesPage({
  searchParams,
}: {
  searchParams: { ok?: string; erro?: string };
}) {
  const sugestoes = await getMinhasSugestoes();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/plataforma"
        className="inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Voltar ao início
      </Link>

      <div className="mt-6">
        <span className="eyebrow">
          <Lightbulb size={13} /> Ajude a montar o acervo
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
          Sugira os próximos livros
        </h1>
        <p className="mt-2 text-white/55">
          Tem um dark romance que você quer ver aqui? Manda pra gente — as mais
          pedidas entram na fila de aquisição.
        </p>
      </div>

      {/* feedback */}
      {searchParams.ok && (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300">
          <CheckCircle2 size={15} /> Sugestão enviada! Obrigada — vamos analisar com carinho. 🖤
        </div>
      )}
      {searchParams.erro && (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-blood-600/40 bg-blood-900/30 px-3 py-2.5 text-sm text-smoke">
          <AlertCircle size={15} /> {searchParams.erro}
        </div>
      )}

      {/* formulário */}
      <form action={sugerirLivro} className="glass mt-6 rounded-2xl p-6 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
              Título do livro *
            </label>
            <input name="titulo" required placeholder="Ex.: Corte de Espinhos e Rosas" className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
              Autora (se souber)
            </label>
            <input name="autora" placeholder="Ex.: Sarah J. Maas" className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
              Por que quer esse livro? (opcional)
            </label>
            <textarea
              name="comentario"
              rows={3}
              placeholder="Conte o que te faz querer ler esse título aqui no clube…"
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>
        <button type="submit" className="btn-primary mt-5 !py-3">
          <Send size={15} /> Enviar sugestão
        </button>
      </form>

      {/* lista */}
      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl font-bold text-white">
          Suas sugestões {sugestoes.length > 0 && <span className="text-white/40">· {sugestoes.length}</span>}
        </h2>

        {sugestoes.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <BookHeart size={26} className="mx-auto text-champagne/70" />
            <p className="mt-3 text-sm text-white/55">
              Você ainda não sugeriu nenhum livro. Que tal começar? 👆
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {sugestoes.map((s) => {
              const st = STATUS[s.status];
              return (
                <li key={s.id} className="glass rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-semibold text-white">{s.titulo}</h3>
                      {s.autora && <p className="text-sm text-white/50">{s.autora}</p>}
                      {s.comentario && (
                        <p className="mt-2 text-sm leading-relaxed text-white/65">“{s.comentario}”</p>
                      )}
                      <p className="mt-2 text-[11px] uppercase tracking-wider text-white/35">
                        Enviada em {new Date(s.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${st.cls}`}>
                        {st.label}
                      </span>
                      <form action={apagarSugestao}>
                        <input type="hidden" name="id" value={s.id} />
                        <button
                          type="submit"
                          className="grid h-8 w-8 place-items-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-blood-500"
                          aria-label="Remover sugestão"
                        >
                          <Trash2 size={15} />
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
