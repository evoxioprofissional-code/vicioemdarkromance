import { Lightbulb, Clock, CheckCircle2, TrendingUp, Mail } from "lucide-react";
import { StatCard, AdminHeading } from "@/components/admin/UI";
import { getSugestoes, maisPedidos, type SugestaoAdmin } from "@/lib/queries/admin";
import { atualizarStatusSugestao } from "@/lib/actions/admin-sugestoes";

const STATUS: Record<SugestaoAdmin["status"], { label: string; cls: string }> = {
  pendente: { label: "Pendente", cls: "border-white/15 bg-white/5 text-white/60" },
  avaliando: { label: "Em avaliação", cls: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
  adicionado: { label: "Adicionado", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
  recusado: { label: "Recusado", cls: "border-blood-600/40 bg-blood-900/30 text-blood-500" },
};

// Opções de ação (o botão do status atual fica destacado).
const ACOES: { status: SugestaoAdmin["status"]; label: string }[] = [
  { status: "avaliando", label: "Avaliar" },
  { status: "adicionado", label: "Adicionar" },
  { status: "recusado", label: "Recusar" },
  { status: "pendente", label: "Pendente" },
];

export default async function AdminSugestoesPage() {
  const sugestoes = await getSugestoes();
  const pendentes = sugestoes.filter((s) => s.status === "pendente").length;
  const adicionadas = sugestoes.filter((s) => s.status === "adicionado").length;
  const top = maisPedidos(sugestoes);

  return (
    <div>
      <AdminHeading
        titulo="Sugestões de livros"
        sub="Títulos pedidos pelas assinantes — use pra montar a fila de aquisição"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Total de sugestões" valor={String(sugestoes.length)} icon={<Lightbulb size={18} />} destaque />
        <StatCard label="Pendentes" valor={String(pendentes)} icon={<Clock size={18} />} />
        <StatCard label="Já adicionadas" valor={String(adicionadas)} icon={<CheckCircle2 size={18} />} />
      </div>

      {/* Mais pedidos */}
      {top.length > 0 && (
        <div className="mt-6 glass rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-white">
            <TrendingUp size={18} className="text-champagne" /> Mais pedidos
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {top.map((t) => (
              <span key={t.titulo} className="inline-flex items-center gap-2 rounded-full border border-champagne/25 bg-blood-900/20 px-3.5 py-1.5 text-sm text-white/80">
                {t.titulo}
                <span className="rounded-full bg-blood-800/50 px-2 py-0.5 text-xs font-bold text-champagne">
                  {t.total}×
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="mt-6">
        {sugestoes.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-sm text-white/45">
            Nenhuma sugestão ainda. Assim que as assinantes enviarem, elas aparecem aqui.
          </div>
        ) : (
          <ul className="space-y-3">
            {sugestoes.map((s) => {
              const st = STATUS[s.status];
              return (
                <li key={s.id} className="glass rounded-2xl p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-semibold text-white">{s.titulo}</h3>
                        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${st.cls}`}>
                          {st.label}
                        </span>
                      </div>
                      {s.autora && <p className="text-sm text-white/50">{s.autora}</p>}
                      {s.comentario && (
                        <p className="mt-2 text-sm leading-relaxed text-white/65">“{s.comentario}”</p>
                      )}
                      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/40">
                        <span className="inline-flex items-center gap-1">
                          <Mail size={11} /> {s.nome || "—"} · {s.email}
                        </span>
                        <span>
                          {new Date(s.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </p>
                    </div>

                    {/* ações de status */}
                    <div className="flex shrink-0 flex-wrap gap-2">
                      {ACOES.map((a) => {
                        const ativo = s.status === a.status;
                        return (
                          <form key={a.status} action={atualizarStatusSugestao}>
                            <input type="hidden" name="id" value={s.id} />
                            <input type="hidden" name="status" value={a.status} />
                            <button
                              type="submit"
                              disabled={ativo}
                              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                                ativo
                                  ? "cursor-default border-champagne/40 bg-blood-800/40 text-champagne"
                                  : "border-white/10 text-white/55 hover:border-white/25 hover:text-white"
                              }`}
                            >
                              {a.label}
                            </button>
                          </form>
                        );
                      })}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
