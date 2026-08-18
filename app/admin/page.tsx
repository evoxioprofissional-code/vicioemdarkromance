import Link from "next/link";
import {
  DollarSign,
  Users,
  UserPlus,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { AreaChart, HBars } from "@/components/admin/Charts";
import { StatCard, AdminHeading, StatusBadge } from "@/components/admin/UI";
import {
  kpis,
  brl,
  receitaMensal,
  origemVendas,
  clientes,
} from "@/data/admin";

export default function AdminDashboard() {
  const ultimos = clientes.slice(0, 5);

  return (
    <div>
      <AdminHeading
        titulo="Dashboard financeira"
        sub="Visão geral do faturamento e da base de assinantes · atualizado hoje, 19:09"
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Receita recorrente (MRR)"
          valor={brl(kpis.mrr)}
          variacao="+8,8% vs. mês anterior"
          icon={<DollarSign size={18} />}
          destaque
        />
        <StatCard
          label="Faturamento do mês"
          valor={brl(kpis.receitaMes)}
          variacao="+12,3%"
          icon={<TrendingDown size={18} className="rotate-180" />}
        />
        <StatCard
          label="Assinantes ativos"
          valor={kpis.assinantesAtivos.toLocaleString("pt-BR")}
          variacao={`+${kpis.novos30d} em 30 dias`}
          icon={<Users size={18} />}
        />
        <StatCard
          label="Churn (30 dias)"
          valor={`${kpis.churn.toString().replace(".", ",")}%`}
          variacao={`${kpis.cancelados30d} cancelamentos`}
          positivo={false}
          icon={<UserPlus size={18} />}
        />
      </div>

      {/* Gráfico de receita + origem */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="glass rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                Receita nos últimos 12 meses
              </h2>
              <p className="text-xs text-white/45">Faturamento mensal (R$)</p>
            </div>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              +287% no período
            </span>
          </div>
          <AreaChart data={receitaMensal} formatValor={brl} />
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-bold text-white">
            Origem das vendas
          </h2>
          <p className="mb-5 text-xs text-white/45">De onde vêm os assinantes</p>
          <HBars
            data={origemVendas.map((o) => ({ label: o.origem, valor: o.pct }))}
            sufixo="%"
          />
        </div>
      </div>

      {/* Resumo financeiro + últimos clientes */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-5 font-display text-lg font-bold text-white">
            Resumo do mês
          </h2>
          <dl className="space-y-4 text-sm">
            {[
              ["Receita acumulada (ano)", brl(kpis.receitaAcumulada)],
              ["Ticket médio", brl(kpis.ticketMedio) + "/mês"],
              ["LTV médio por cliente", brl(kpis.ltv)],
              ["Novos assinantes (30d)", `+${kpis.novos30d}`],
              ["Cancelamentos (30d)", `−${kpis.cancelados30d}`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                <dt className="text-white/55">{k}</dt>
                <dd className="font-semibold text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white">
              Assinantes recentes
            </h2>
            <Link
              href="/admin/clientes"
              className="inline-flex items-center gap-1 text-sm text-champagne hover:text-champagne-light"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {ultimos.map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blood-800/40 font-display text-sm font-bold text-champagne ring-1 ring-champagne/20">
                  {c.nome.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{c.nome}</p>
                  <p className="truncate text-xs text-white/40">{c.email}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
