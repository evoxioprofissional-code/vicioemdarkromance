import { ShoppingBag, Repeat, UserPlus, Percent } from "lucide-react";
import { BarChart, AreaChart, HBars } from "@/components/admin/Charts";
import { StatCard, AdminHeading } from "@/components/admin/UI";
import {
  novosAssinantes,
  receitaMensal,
  topLivros,
  brl,
  kpis,
} from "@/data/admin";

export default function VendasPage() {
  const totalNovos = novosAssinantes.reduce((s, m) => s + m.valor, 0);

  return (
    <div>
      <AdminHeading
        titulo="Volume de vendas"
        sub="Assinaturas, renovações e conversão ao longo do tempo"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Vendas no mês"
          valor={`${kpis.novos30d}`}
          variacao="+3,5% vs. mês anterior"
          icon={<ShoppingBag size={18} />}
          destaque
        />
        <StatCard
          label="Renovações no mês"
          valor="1.023"
          variacao="95,3% de retenção"
          icon={<Repeat size={18} />}
        />
        <StatCard
          label="Novos assinantes (12m)"
          valor={totalNovos.toLocaleString("pt-BR")}
          variacao="+287% no período"
          icon={<UserPlus size={18} />}
        />
        <StatCard
          label="Taxa de conversão"
          valor="6,8%"
          variacao="visitantes → assinantes"
          icon={<Percent size={18} />}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-bold text-white">
            Novos assinantes por mês
          </h2>
          <p className="mb-6 text-xs text-white/45">Últimos 12 meses</p>
          <BarChart data={novosAssinantes} />
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-bold text-white">
            Faturamento por mês
          </h2>
          <p className="mb-6 text-xs text-white/45">Receita reconhecida (R$)</p>
          <AreaChart data={receitaMensal} formatValor={brl} altura={224} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-1 font-display text-lg font-bold text-white">
            Livros que mais convertem em leitura
          </h2>
          <p className="mb-5 text-xs text-white/45">Aberturas nos últimos 30 dias</p>
          <HBars
            data={topLivros.map((l) => ({ label: l.titulo, valor: l.leituras }))}
          />
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="mb-5 font-display text-lg font-bold text-white">
            Formas de pagamento
          </h2>
          <HBars
            data={[
              { label: "Cartão de crédito", valor: 68 },
              { label: "Pix", valor: 24 },
              { label: "Boleto", valor: 8 },
            ]}
            sufixo="%"
          />
          <div className="mt-6 rounded-xl border border-champagne/15 bg-blood-900/15 p-4 text-sm text-white/60">
            💡 O Pix vem crescendo mês a mês — vale destacar essa opção no
            checkout quando o gateway real for conectado.
          </div>
        </div>
      </div>
    </div>
  );
}
