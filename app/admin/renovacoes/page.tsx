import { UserX, AlertTriangle, RotateCcw, TrendingDown } from "lucide-react";
import { StatCard, AdminHeading } from "@/components/admin/UI";
import ClientesTable from "@/components/admin/ClientesTable";
import { getNaoRenovaram, getDashboard } from "@/lib/queries/admin";

export default async function RenovacoesPage() {
  const [naoRenovaram, kpis] = await Promise.all([getNaoRenovaram(), getDashboard()]);
  const inadimplentes = naoRenovaram.filter((c) => c.status === "past_due").length;
  const cancelados = naoRenovaram.filter((c) => c.status === "canceled").length;

  return (
    <div>
      <AdminHeading
        titulo="Clientes que não renovaram"
        sub="Cancelamentos e falhas de cobrança — oportunidades de recuperação"
        acao={
          naoRenovaram.length > 0 ? (
            <button className="btn-primary !py-2.5 !text-[13px]">
              <RotateCcw size={15} /> Enviar campanha de retorno
            </button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Não renovaram" valor={String(naoRenovaram.length)} icon={<UserX size={18} />} positivo={false} destaque />
        <StatCard label="Cancelaram" valor={String(cancelados)} icon={<TrendingDown size={18} />} positivo={false} />
        <StatCard label="Falha no pagamento" valor={String(inadimplentes)} icon={<AlertTriangle size={18} />} positivo={false} />
        <StatCard label="Churn (30 dias)" valor={`${kpis.churn.toString().replace(".", ",")}%`} variacao="meta: abaixo de 5%" />
      </div>

      <div className="mt-6">
        {naoRenovaram.length > 0 ? (
          <ClientesTable clientes={naoRenovaram} filtros={false} mostrarMotivo />
        ) : (
          <div className="glass rounded-2xl p-10 text-center text-sm text-white/45">
            🎉 Nenhum cancelamento ou inadimplência no momento.
          </div>
        )}
      </div>
    </div>
  );
}
