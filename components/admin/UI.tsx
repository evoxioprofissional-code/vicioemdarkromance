import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { StatusCliente } from "@/data/admin";

/** Card de KPI com valor, rótulo e variação. */
export function StatCard({
  label,
  valor,
  variacao,
  positivo = true,
  icon,
  destaque = false,
}: {
  label: string;
  valor: string;
  variacao?: string;
  positivo?: boolean;
  icon?: React.ReactNode;
  destaque?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        destaque
          ? "glass-strong ring-1 ring-champagne/25 shadow-glow"
          : "glass"
      }`}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs uppercase tracking-wider text-white/45">{label}</p>
        {icon && <span className="text-champagne/70">{icon}</span>}
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold text-white sm:text-[28px]">
        {valor}
      </p>
      {variacao && (
        <p
          className={`mt-1.5 inline-flex items-center gap-1 text-xs font-medium ${
            positivo ? "text-emerald-400/90" : "text-blood-500"
          }`}
        >
          {positivo ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {variacao}
        </p>
      )}
    </div>
  );
}

/** Título de seção do admin. */
export function AdminHeading({
  titulo,
  sub,
  acao,
}: {
  titulo: string;
  sub?: string;
  acao?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
          {titulo}
        </h1>
        {sub && <p className="mt-1 text-sm text-white/50">{sub}</p>}
      </div>
      {acao}
    </div>
  );
}

const STATUS: Record<
  StatusCliente,
  { label: string; cls: string }
> = {
  ativo: { label: "Ativo", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
  inadimplente: { label: "Inadimplente", cls: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
  cancelado: { label: "Cancelado", cls: "border-blood-600/40 bg-blood-900/30 text-blood-500" },
};

export function StatusBadge({ status }: { status: StatusCliente }) {
  const s = STATUS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${s.cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}
