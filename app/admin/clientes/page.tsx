import { Users, UserCheck, AlertTriangle, UserX } from "lucide-react";
import { StatCard, AdminHeading } from "@/components/admin/UI";
import ClientesTable from "@/components/admin/ClientesTable";
import { getClientes } from "@/lib/queries/admin";

export default async function ClientesPage() {
  const clientes = await getClientes();
  const ativos = clientes.filter((c) => c.status === "active").length;
  const inadimplentes = clientes.filter((c) => c.status === "past_due").length;
  const cancelados = clientes.filter((c) => c.status === "canceled").length;

  return (
    <div>
      <AdminHeading titulo="Controle de clientes" sub="Gerencie assinantes, status e cobranças" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total de clientes" valor={String(clientes.length)} icon={<Users size={18} />} destaque />
        <StatCard label="Ativos" valor={String(ativos)} icon={<UserCheck size={18} />} />
        <StatCard label="Inadimplentes" valor={String(inadimplentes)} icon={<AlertTriangle size={18} />} positivo={false} />
        <StatCard label="Cancelados" valor={String(cancelados)} icon={<UserX size={18} />} positivo={false} />
      </div>

      <div className="mt-6">
        {clientes.length > 0 ? (
          <ClientesTable clientes={clientes} />
        ) : (
          <div className="glass rounded-2xl p-10 text-center text-sm text-white/45">
            Nenhum cliente cadastrado ainda. Assim que as pessoas criarem conta, elas aparecem aqui.
          </div>
        )}
      </div>
    </div>
  );
}
