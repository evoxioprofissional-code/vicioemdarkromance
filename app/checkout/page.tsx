import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Lock,
  ShieldCheck,
  ArrowLeft,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import Logo from "@/components/Logo";
import { getPlano } from "@/lib/queries/plans";
import { finalizarAssinatura } from "@/lib/actions/checkout";
import type { Plano } from "@/lib/types";

// ============================================================
//  CHECKOUT
//  O formulário de cartão é visual (gateway ainda não conectado).
//  O botão "Finalizar" ativa a assinatura do usuário logado.
// ============================================================

function Resumo({ plano }: { plano: Plano }) {
  return (
    <aside className="glass-strong h-fit rounded-2xl p-7 lg:sticky lg:top-8">
      <h2 className="font-display text-xl font-bold text-white">Resumo do plano</h2>
      <div className="my-5 rule" />

      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-champagne">
            Plano {plano.nome}
          </p>
          <p className="text-xs uppercase tracking-widest text-white/40">
            {plano.periodo} de acesso
          </p>
        </div>
        <span className="font-display text-2xl font-extrabold text-white">
          {plano.precoMes}
          <span className="text-sm font-normal text-white/40">/mês</span>
        </span>
      </div>

      <ul className="mt-6 space-y-2.5">
        {plano.beneficios.map((b) => (
          <li key={b} className="flex items-center gap-2.5 text-sm text-white/65">
            <CheckCircle2 size={15} className="shrink-0 text-champagne" />
            {b}
          </li>
        ))}
      </ul>

      <div className="my-5 rule" />
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/55">{plano.cobranca}</span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-semibold text-white">Total hoje</span>
        <span className="font-display text-xl font-bold text-gilded">
          {plano.precoMes}
        </span>
      </div>

      <p className="mt-5 flex items-center gap-2 text-[11px] text-white/40">
        <ShieldCheck size={14} className="text-champagne" /> Renovação automática ·
        cancele quando quiser
      </p>
    </aside>
  );
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { plano?: string };
}) {
  const plano = await getPlano(searchParams.plano);
  if (!plano) return notFound();

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-radial-blood opacity-70" />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Logo />
        <Link
          href="/#planos"
          className="inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft size={15} /> Trocar plano
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="mb-8">
          <span className="eyebrow">
            <Lock size={13} /> Pagamento seguro
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Falta um passo para o seu vício
          </h1>
          <p className="mt-2 text-white/55">
            Preencha os dados e ganhe acesso imediato à biblioteca completa.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          {/* -------- Formulário -------- */}
          {/* Campos de cartão são visuais (gateway ainda não conectado);
              o submit ativa a assinatura do usuário logado. */}
          <form action={finalizarAssinatura} className="glass rounded-2xl p-7 sm:p-8">
            {/* Dados da conta */}
            <h3 className="mb-4 font-display text-lg font-semibold text-white">
              Seus dados
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Nome completo" placeholder="Como no cartão" span2 />
              <Campo label="E-mail" placeholder="voce@email.com" type="email" span2 />
            </div>

            <div className="my-7 rule" />

            {/* Pagamento */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-white">
                Cartão de crédito
              </h3>
              <div className="flex items-center gap-1.5 text-white/30">
                <CreditCard size={18} />
                <span className="text-[10px] uppercase tracking-widest">
                  Visa · Master · Elo
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Campo
                label="Número do cartão"
                placeholder="0000 0000 0000 0000"
                icon={<CreditCard size={15} />}
                span2
              />
              <Campo label="Validade" placeholder="MM/AA" />
              <Campo label="CVV" placeholder="123" />
              <Campo label="Nome impresso no cartão" placeholder="NOME SOBRENOME" span2 />
              <Campo label="CPF do titular" placeholder="000.000.000-00" span2 />
            </div>

            <label className="mt-6 flex items-start gap-3 text-sm text-white/55">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-transparent accent-blood-600"
              />
              <span>
                Confirmo ter mais de 18 anos e concordo com os termos de uso e a
                política de privacidade.
              </span>
            </label>

            <button
              type="submit"
              className="btn-primary mt-7 w-full justify-center !py-4 text-base"
            >
              <Lock size={16} /> Finalizar assinatura
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-white/35">
              <ShieldCheck size={14} className="text-champagne" />
              Ambiente criptografado · seus dados estão protegidos
            </p>
          </form>

          <Resumo plano={plano} />
        </div>
      </div>
    </main>
  );
}

/** Campo de formulário estilizado (sem lógica/validação). */
function Campo({
  label,
  placeholder,
  type = "text",
  icon,
  span2 = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  icon?: React.ReactNode;
  span2?: boolean;
}) {
  return (
    <div className={span2 ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-white/10 bg-ink-800/60 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-champagne/40 focus:ring-1 focus:ring-champagne/20 ${
            icon ? "pl-9 pr-3" : "px-3"
          }`}
        />
      </div>
    </div>
  );
}
