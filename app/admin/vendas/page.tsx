import { ShoppingBag, Repeat, UserPlus, Percent } from "lucide-react";
import { BarChart, AreaChart, HBars } from "@/components/admin/Charts";
import { StatCard, AdminHeading } from "@/components/admin/UI";
import { brl } from "@/lib/types";
import {
  getDashboard,
  getReceitaMensal,
  getNovosAssinantesMensal,
  getTopLivros,
} from "@/lib/queries/admin";

export default async function VendasPage() {
  const [kpis, novosMensal, receita, top] = await Promise.all([
    getDashboard(),
    getNovosAssinantesMensal(),
    getReceitaMensal(),
    getTopLivros(),
  ]);
  const totalNovos = novosMensal.reduce((s, m) => s + m.valor, 0);

  return (
    <div>
      <AdminHeading
        titulo="Volume de vendas"
        sub="Assinaturas, faturamento e engajamento ao longo do tempo"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Vendas no mês" valor={String(kpis.novos30d)} icon={<ShoppingBag size={18} />} destaque />
        <StatCard label="Assinantes ativos" valor={String(kpis.assinantesAtivos)} icon={<Repeat size={18} />} />
        <StatCard label="Novos assinantes (12m)" valor={totalNovos.toLocaleString("pt-BR")} icon={<UserPlus size={18} />} />
        <StatCard label="Faturamento do mês" valor={brl(kpis.receitaMes)} icon={<Percent size={18} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-bold text-white">Novos assinantes por mês</h2>
          <p className="mb-6 text-xs text-white/45">Últimos 12 meses</p>
          <BarChart data={novosMensal} />
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-bold text-white">Faturamento por mês</h2>
          <p className="mb-6 text-xs text-white/45">Receita reconhecida (R$)</p>
          <AreaChart data={receita} formatValor={brl} altura={224} />
        </div>
      </div>

      <div className="mt-6 glass rounded-2xl p-6">
        <h2 className="mb-1 font-display text-lg font-bold text-white">
          Livros que mais convertem em leitura
        </h2>
        <p className="mb-5 text-xs text-white/45">Aberturas registradas</p>
        {top.length > 0 ? (
          <HBars data={top.map((l) => ({ label: l.titulo, valor: l.leituras }))} />
        ) : (
          <p className="py-8 text-center text-sm text-white/40">
            Ainda não há leituras registradas.
          </p>
        )}
      </div>
    </div>
  );
}
