import { Users, UserCheck, AlertTriangle, UserX } from "lucide-react";
import { StatCard, AdminHeading } from "@/components/admin/UI";
import ClientesTable from "@/components/admin/ClientesTable";
import { clientes } from "@/data/admin";

export default function ClientesPage() {
  const ativos = clientes.filter((c) => c.status === "ativo").length;
  const inadimplentes = clientes.filter((c) => c.status === "inadimplente").length;
  const cancelados = clientes.filter((c) => c.status === "cancelado").length;

  return (
    <div>
      <AdminHeading
        titulo="Controle de clientes"
        sub="Gerencie assinantes, status e cobranças"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total de clientes" valor={String(clientes.length)} icon={<Users size={18} />} destaque />
        <StatCard label="Ativos" valor={String(ativos)} icon={<UserCheck size={18} />} />
        <StatCard label="Inadimplentes" valor={String(inadimplentes)} icon={<AlertTriangle size={18} />} positivo={false} />
        <StatCard label="Cancelados" valor={String(cancelados)} icon={<UserX size={18} />} positivo={false} />
      </div>

      <div className="mt-6">
        <ClientesTable clientes={clientes} />
      </div>
    </div>
  );
}
