import Link from "next/link";
import {
  Crown,
  CreditCard,
  Mail,
  UserRound,
  BookOpen,
  Settings2,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import Stars from "@/components/Stars";
import { livros } from "@/data/livros";

// ============================================================
//  MINHA CONTA — PROTÓTIPO VISUAL (dados fictícios, sem lógica)
// ============================================================

const PERFIL = {
  nome: "Marina Oliveira",
  email: "marina.oliveira@email.com",
  desde: "Janeiro de 2026",
  lidos: 27,
};

const lendo = livros.slice(0, 4);

export default function ContaPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/plataforma"
        className="inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Voltar ao início
      </Link>

      {/* ---------- Cabeçalho do perfil ---------- */}
      <div className="mt-6 flex flex-col items-center gap-5 rounded-3xl border border-white/5 bg-ink-800/40 p-8 text-center sm:flex-row sm:text-left">
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blood-700 to-blood-900 font-display text-3xl font-black text-champagne ring-1 ring-champagne/30 shadow-glow">
          {PERFIL.nome.charAt(0)}
        </span>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-white">
            {PERFIL.nome}
          </h1>
          <p className="text-sm text-white/50">{PERFIL.email}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-white/35">
            Leitora desde {PERFIL.desde} · {PERFIL.lidos} livros lidos
          </p>
        </div>
        <button className="btn-ghost !py-2.5">
          <Settings2 size={15} /> Editar perfil
        </button>
      </div>

      {/* ---------- Plano atual ---------- */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="glass-strong rounded-2xl p-7 ring-1 ring-champagne/20">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-champagne">
              <Crown size={18} />
              <span className="font-display text-lg font-bold">Acesso Total</span>
            </span>
            <span className="rounded-full bg-blood-800/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-smoke">
              Ativo
            </span>
          </div>
          <div className="my-5 rule" />
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-white/50">Valor</dt>
              <dd className="text-white">R$ 9,99/mês</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/50">Próxima cobrança</dt>
              <dd className="text-white">12 de setembro de 2026</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/50">Forma de pagamento</dt>
              <dd className="flex items-center gap-1.5 text-white">
                <CreditCard size={14} className="text-white/40" /> •••• 4821
              </dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/#planos" className="btn-primary !py-2.5 flex-1 justify-center">
              Gerenciar assinatura
            </Link>
            <button className="btn-ghost !py-2.5">Cancelar</button>
          </div>
        </div>

        {/* ---------- Dados da conta ---------- */}
        <div className="glass rounded-2xl p-7">
          <h2 className="font-display text-lg font-bold text-white">
            Dados da conta
          </h2>
          <div className="my-5 rule" />
          <div className="space-y-4">
            <LinhaDado icon={UserRound} label="Nome" valor={PERFIL.nome} />
            <LinhaDado icon={Mail} label="E-mail" valor={PERFIL.email} />
            <LinhaDado
              icon={BookOpen}
              label="Preferências"
              valor="Máfia · Dark & Forbidden · Possessivo"
            />
          </div>
          <button className="btn-ghost mt-6 w-full justify-center !py-2.5">
            Gerenciar preferências
          </button>
        </div>
      </div>

      {/* ---------- Continuar lendo ---------- */}
      <section className="mt-10">
        <h2 className="mb-5 font-display text-xl font-bold text-white">
          Continuar lendo
        </h2>
        <div className="space-y-3">
          {lendo.map((l, i) => {
            const progresso = [72, 41, 88, 15][i];
            return (
              <Link
                key={l.id}
                href={`/plataforma/livro/${l.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-ink-800/40 p-3 transition-colors hover:border-champagne/20"
              >
                <span
                  className="grid h-14 w-10 shrink-0 place-items-center rounded-md text-[8px] font-bold uppercase text-white/70"
                  style={{
                    background: `linear-gradient(160deg, ${l.capa.para}, ${l.capa.de})`,
                  }}
                >
                  V
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-base font-semibold text-white">
                    {l.titulo}
                  </p>
                  <p className="truncate text-xs text-white/45">{l.autora}</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blood-600 to-champagne"
                      style={{ width: `${progresso}%` }}
                    />
                  </div>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                  <span className="text-sm font-semibold text-champagne">
                    {progresso}%
                  </span>
                  <div className="mt-1">
                    <Stars nota={l.nota} size={11} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
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
