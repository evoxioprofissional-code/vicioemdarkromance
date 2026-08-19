import { UserX, AlertTriangle, TrendingDown } from "lucide-react";
import { StatCard, AdminHeading } from "@/components/admin/UI";
import RecuperacaoWhatsApp from "@/components/admin/RecuperacaoWhatsApp";
import { getNaoRenovaram, getDashboard } from "@/lib/queries/admin";

export default async function RenovacoesPage() {
  const [naoRenovaram, kpis] = await Promise.all([getNaoRenovaram(), getDashboard()]);
  const inadimplentes = naoRenovaram.filter((c) => c.status === "past_due").length;
  const cancelados = naoRenovaram.filter((c) => c.status === "canceled").length;

  return (
    <div>
      <AdminHeading
        titulo="Recuperação de clientes"
        sub="Cancelamentos e falhas de cobrança — traga suas leitoras de volta pelo WhatsApp"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Não renovaram" valor={String(naoRenovaram.length)} icon={<UserX size={18} />} positivo={false} destaque />
        <StatCard label="Cancelaram" valor={String(cancelados)} icon={<TrendingDown size={18} />} positivo={false} />
        <StatCard label="Falha no pagamento" valor={String(inadimplentes)} icon={<AlertTriangle size={18} />} positivo={false} />
        <StatCard label="Churn (30 dias)" valor={`${kpis.churn.toString().replace(".", ",")}%`} variacao="meta: abaixo de 5%" />
      </div>

      <div className="mt-6">
        <RecuperacaoWhatsApp clientes={naoRenovaram} />
      </div>
    </div>
  );
}
