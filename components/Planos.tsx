import Link from "next/link";
import { Check, Crown, ShieldCheck } from "lucide-react";
import { planos } from "@/data/planos";

/** Oferta única de assinatura. O botão "Assinar" leva ao checkout. */
export default function Planos() {
  const plano = planos[0];

  return (
    <div className="mx-auto max-w-md">
      <div className="glass-strong relative flex flex-col rounded-3xl p-8 shadow-glow ring-1 ring-champagne/30">
        <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-blood-700 to-blood-800 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-glow">
          <Crown size={12} /> Assinatura oficial
        </span>

        <div className="text-center">
          <h3 className="font-display text-2xl font-bold text-white">
            {plano.nome}
          </h3>
          <p className="mt-1 text-xs uppercase tracking-widest text-white/40">
            Acesso ilimitado à biblioteca
          </p>

          <div className="mt-6 flex items-end justify-center gap-1.5">
            <span className="font-display text-6xl font-extrabold text-gilded">
              {plano.precoMes}
            </span>
            <span className="pb-2 text-base text-white/45">/mês</span>
          </div>
          <p className="mt-2 text-xs text-white/45">{plano.cobranca}</p>
        </div>

        <div className="my-7 rule" />

        <ul className="mb-8 space-y-3.5">
          {plano.beneficios.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm text-white/75">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blood-800/50 text-champagne">
                <Check size={12} strokeWidth={3} />
              </span>
              {b}
            </li>
          ))}
        </ul>

        <Link
          href={`/checkout?plano=${plano.id}`}
          className="btn-primary w-full justify-center !py-4 text-base"
        >
          Assinar agora
        </Link>

        <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-white/40">
          <ShieldCheck size={14} className="text-champagne" />
          Pagamento seguro · cancele quando quiser
        </p>
      </div>
    </div>
  );
}
