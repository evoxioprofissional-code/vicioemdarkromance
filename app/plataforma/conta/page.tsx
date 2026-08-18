import Link from "next/link";
import {
  Crown,
  Mail,
  UserRound,
  BookOpen,
  ArrowLeft,
  Lock,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import Stars from "@/components/Stars";
import { getPerfil, getMinhaAssinatura, getMeuProgresso } from "@/lib/queries/account";
import { cancelarAssinatura } from "@/lib/actions/checkout";
import { brl } from "@/lib/types";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  active: { label: "Ativa", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
  past_due: { label: "Pagamento pendente", cls: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
  canceled: { label: "Cancelada", cls: "border-blood-600/40 bg-blood-900/30 text-blood-500" },
  inactive: { label: "Inativa", cls: "border-white/15 bg-white/5 text-white/60" },
};

export default async function ContaPage({
  searchParams,
}: {
  searchParams: { assine?: string; cancelada?: string };
}) {
  const [perfil, assinatura, progresso] = await Promise.all([
    getPerfil(),
    getMinhaAssinatura(),
    getMeuProgresso(),
  ]);

  if (!perfil) {
    return <p className="text-white/50">Faça login para ver sua conta.</p>;
  }

  const status = assinatura?.status ?? "inactive";
  const st = STATUS_LABEL[status];
  const desde = new Date(perfil.createdAt).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/plataforma"
        className="inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Voltar ao início
      </Link>

      {/* Avisos */}
      {searchParams.assine && perfil.role !== "admin" && (
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-champagne/25 bg-blood-900/20 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 font-display text-lg font-semibold text-champagne">
              <Lock size={18} /> Conteúdo exclusivo para assinantes
            </p>
            <p className="mt-1 text-sm text-white/60">
              Assine o Acesso Total para liberar a biblioteca completa.
            </p>
          </div>
          <Link href="/checkout?plano=mensal" className="btn-primary !py-2.5 shrink-0">
            Assinar agora
          </Link>
        </div>
      )}
      {searchParams.cancelada && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          <CheckCircle2 size={16} className="text-champagne" /> Assinatura cancelada. Você
          tem acesso até o fim do período já pago.
        </div>
      )}

      {/* Cabeçalho do perfil */}
      <div className="mt-6 flex flex-col items-center gap-5 rounded-3xl border border-white/5 bg-ink-800/40 p-8 text-center sm:flex-row sm:text-left">
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blood-700 to-blood-900 font-display text-3xl font-black text-champagne ring-1 ring-champagne/30 shadow-glow">
          {perfil.nome.charAt(0).toUpperCase()}
        </span>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-white">{perfil.nome}</h1>
          <p className="text-sm text-white/50">{perfil.email}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-white/35">
            Leitora desde {desde}
            {progresso.length > 0 && ` · ${progresso.length} livros em leitura`}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Assinatura */}
        <div className="glass-strong rounded-2xl p-7 ring-1 ring-champagne/20">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-champagne">
              <Crown size={18} />
              <span className="font-display text-lg font-bold">Acesso Total</span>
            </span>
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${st.cls}`}>
              {st.label}
            </span>
          </div>
          <div className="my-5 rule" />
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-white/50">Valor</dt>
              <dd className="text-white">{brl(assinatura?.priceCents ?? 999)}/mês</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/50">Próxima cobrança</dt>
              <dd className="text-white">
                {assinatura?.currentPeriodEnd
                  ? new Date(assinatura.currentPeriodEnd).toLocaleDateString("pt-BR")
                  : "—"}
              </dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            {status === "active" ? (
              <form action={cancelarAssinatura} className="flex-1">
                <button type="submit" className="btn-ghost !py-2.5 w-full justify-center">
                  Cancelar assinatura
                </button>
              </form>
            ) : (
              <Link href="/checkout?plano=mensal" className="btn-primary !py-2.5 flex-1 justify-center">
                Ativar assinatura
              </Link>
            )}
          </div>
        </div>

        {/* Dados da conta */}
        <div className="glass rounded-2xl p-7">
          <h2 className="font-display text-lg font-bold text-white">Dados da conta</h2>
          <div className="my-5 rule" />
          <div className="space-y-4">
            <LinhaDado icon={UserRound} label="Nome" valor={perfil.nome} />
            <LinhaDado icon={Mail} label="E-mail" valor={perfil.email} />
            <LinhaDado
              icon={BookOpen}
              label="Tipo de conta"
              valor={perfil.role === "admin" ? "Administrador" : "Assinante"}
            />
          </div>
          {perfil.role === "admin" && (
            <Link href="/admin" className="btn-ghost mt-6 w-full justify-center !py-2.5">
              Abrir painel admin
            </Link>
          )}
        </div>
      </div>

      {/* Continuar lendo */}
      <section className="mt-10">
        <h2 className="mb-5 font-display text-xl font-bold text-white">Continuar lendo</h2>
        {progresso.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-white/55">Você ainda não começou nenhuma leitura.</p>
            <Link href="/plataforma" className="btn-primary mt-4 !py-2.5">
              Explorar a biblioteca
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {progresso.map((p: any, i: number) => {
              const l = p.books;
              if (!l) return null;
              return (
                <Link
                  key={i}
                  href={`/plataforma/livro/${l.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-ink-800/40 p-3 transition-colors hover:border-champagne/20"
                >
                  <span
                    className="grid h-14 w-10 shrink-0 place-items-center rounded-md text-[8px] font-bold uppercase text-white/70"
                    style={{ background: `linear-gradient(160deg, ${l.capa_para}, ${l.capa_de})` }}
                  >
                    V
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-base font-semibold text-white">{l.titulo}</p>
                    <p className="truncate text-xs text-white/45">{l.autora}</p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blood-600 to-champagne"
                        style={{ width: `${p.percent}%` }}
                      />
                    </div>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <span className="text-sm font-semibold text-champagne">{p.percent}%</span>
                    <div className="mt-1">
                      <Stars nota={Number(l.nota)} size={11} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function LinhaDado({
  icon: Icon,
  label,
  valor,
}: {
  icon: LucideIcon;
  label: string;
  valor: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 text-champagne">
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-white/40">{label}</p>
        <p className="truncate text-sm text-white/80">{valor}</p>
      </div>
    </div>
  );
}
