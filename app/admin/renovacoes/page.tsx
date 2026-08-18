import { UserX, AlertTriangle, RotateCcw, TrendingDown } from "lucide-react";
import { StatCard, AdminHeading } from "@/components/admin/UI";
import ClientesTable from "@/components/admin/ClientesTable";
import { naoRenovaram, kpis } from "@/data/admin";

export default function RenovacoesPage() {
  const inadimplentes = naoRenovaram.filter((c) => c.status === "inadimplente").length;
  const cancelados = naoRenovaram.filter((c) => c.status === "cancelado").length;

  return (
    <div>
      <AdminHeading
        titulo="Clientes que não renovaram"
        sub="Cancelamentos e falhas de cobrança — oportunidades de recuperação"
        acao={
          <button className="btn-primary !py-2.5 !text-[13px]">
            <RotateCcw size={15} /> Enviar campanha de retorno
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Não renovaram"
          valor={String(naoRenovaram.length)}
          icon={<UserX size={18} />}
          positivo={false}
          destaque
        />
        <StatCard label="Cancelaram" valor={String(cancelados)} icon={<TrendingDown size={18} />} positivo={false} />
        <StatCard label="Falha no pagamento" valor={String(inadimplentes)} icon={<AlertTriangle size={18} />} positivo={false} />
        <StatCard
          label="Churn (30 dias)"
          valor={`${kpis.churn.toString().replace(".", ",")}%`}
          variacao="meta: abaixo de 5%"
        />
      </div>

      {/* motivos agregados */}
      <div className="mt-6 glass rounded-2xl p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-white">
          Principais motivos
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            ["Falha no cartão / cartão expirado", inadimplentes],
            ["Sem tempo para ler", 1],
            ["Preço", 1],
          ].map(([motivo, qtd]) => (
            <span
              key={motivo as string}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-ink-800/60 px-3.5 py-1.5 text-sm text-white/70"
            >
              {motivo}
              <span className="rounded-full bg-blood-800/50 px-2 py-0.5 text-xs font-bold text-champagne">
                {qtd as number}
              </span>
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-white/45">
          Dica: assinantes com <strong className="text-white/70">falha de cartão</strong> costumam
          voltar com um lembrete automático de atualização de pagamento — recuperação média de ~40%.
        </p>
      </div>

      <div className="mt-6">
        <ClientesTable
          clientes={naoRenovaram}
          filtros={false}
          mostrarMotivo
        />
      </div>
    </div>
  );
}
