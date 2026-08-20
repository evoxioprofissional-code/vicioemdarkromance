import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Lock,
  ShieldCheck,
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  QrCode,
  AlertCircle,
} from "lucide-react";
import Logo from "@/components/Logo";
import { getPlano } from "@/lib/queries/plans";
import { pagarComPix, pagarComCartao } from "@/lib/actions/pagamento";
import type { Plano } from "@/lib/types";

function Resumo({ plano }: { plano: Plano }) {
  return (
    <aside className="glass-strong h-fit rounded-2xl p-7 lg:sticky lg:top-8">
      <h2 className="font-display text-xl font-bold text-white">Resumo</h2>
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
      <div className="flex items-center justify-between">
        <span className="font-semibold text-white">Total hoje</span>
        <span className="font-display text-xl font-bold text-gilded">
          {plano.precoMes}
        </span>
      </div>
      <p className="mt-5 flex items-center gap-2 text-[11px] text-white/40">
        <ShieldCheck size={14} className="text-champagne" /> Cancele quando quiser
      </p>
    </aside>
  );
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { plano?: string; erro?: string };
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
          <ArrowLeft size={15} /> Voltar
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="mb-8">
          <span className="eyebrow">
            <Lock size={13} /> Pagamento seguro
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Escolha como pagar
          </h1>
          <p className="mt-2 text-white/55">
            Assine o Acesso Total e libere a biblioteca completa na hora.
          </p>
        </div>

        {searchParams.erro && (
          <div className="mb-8 flex items-center gap-2 rounded-lg border border-blood-600/40 bg-blood-900/30 px-3 py-2.5 text-sm text-smoke">
            <AlertCircle size={15} /> {searchParams.erro}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            {/* Pix — InfinitePay */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20">
                  <QrCode size={22} />
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-white">Pix</h3>
                  <p className="mt-0.5 text-sm text-white/55">
                    Aprovação na hora. Você paga, o acesso libera na sequência.
                  </p>
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Recomendado
                </span>
              </div>
              <form action={pagarComPix} className="mt-5">
                <button type="submit" className="btn-primary w-full justify-center !py-3.5">
                  <QrCode size={16} /> Pagar {plano.precoMes} com Pix
                </button>
              </form>
            </div>

            {/* Cartão — Mercado Pago (recorrente) */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/5 text-white/60 ring-1 ring-white/10">
                  <CreditCard size={22} />
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-white">Cartão de crédito</h3>
                  <p className="mt-0.5 text-sm text-white/55">
                    Renovação automática todo mês, sem precisar refazer nada.
                  </p>
                </div>
              </div>
              <form action={pagarComCartao} className="mt-5">
                <button type="submit" className="btn-ghost w-full justify-center !py-3.5">
                  <CreditCard size={16} /> Assinar {plano.precoMes}/mês no cartão
                </button>
              </form>
            </div>

            <p className="flex items-center justify-center gap-2 pt-1 text-[11px] text-white/35">
              <ShieldCheck size={14} className="text-champagne" />
              Ambiente seguro · você confirma o pagamento no app do seu banco
            </p>
          </div>

          <Resumo plano={plano} />
        </div>
      </div>
    </main>
  );
}
