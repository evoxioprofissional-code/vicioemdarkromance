import { createAdminClient } from "@/lib/supabase/admin";
import type { Cliente, StatusAssinatura } from "@/lib/types";

// Meses abreviados p/ os gráficos.
const MES_ABREV = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

function fmtData(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR");
}

function mesesEntre(iso: string): number {
  const d = new Date(iso);
  const meses =
    (new Date().getFullYear() - d.getFullYear()) * 12 +
    (new Date().getMonth() - d.getMonth());
  return Math.max(0, meses);
}

// ---- KPIs da dashboard ----
export async function getDashboard() {
  const db = createAdminClient();

  const [{ count: ativos }, { count: totalPerfis }, { data: pagamentos }, { data: cancelamentos }] =
    await Promise.all([
      db.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
      db.from("profiles").select("*", { count: "exact", head: true }),
      db.from("payments").select("amount_cents, paid_at, status").eq("status", "paid"),
      db.from("subscriptions").select("canceled_at").not("canceled_at", "is", null),
    ]);

  const agora = new Date();
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const inicioAno = new Date(agora.getFullYear(), 0, 1);
  const ha30 = new Date(agora.getTime() - 30 * 86400000);

  const pagos = pagamentos ?? [];
  const receitaMes = pagos
    .filter((p) => p.paid_at && new Date(p.paid_at) >= inicioMes)
    .reduce((s, p) => s + (p.amount_cents ?? 0), 0);
  const receitaAno = pagos
    .filter((p) => p.paid_at && new Date(p.paid_at) >= inicioAno)
    .reduce((s, p) => s + (p.amount_cents ?? 0), 0);

  const assinantesAtivos = ativos ?? 0;
  const cancelados30d = (cancelamentos ?? []).filter(
    (c) => c.canceled_at && new Date(c.canceled_at) >= ha30
  ).length;

  // Novos assinantes nos últimos 30 dias (perfis criados).
  const { count: novos30d } = await db
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", ha30.toISOString());

  const base = assinantesAtivos + cancelados30d;
  const churn = base > 0 ? (cancelados30d / base) * 100 : 0;

  return {
    mrr: assinantesAtivos * 999,
    receitaMes,
    receitaAno,
    assinantesAtivos,
    totalClientes: totalPerfis ?? 0,
    novos30d: novos30d ?? 0,
    cancelados30d,
    churn: Math.round(churn * 10) / 10,
    ticketCents: 999,
  };
}

// ---- Série de receita (12 meses) ----
export async function getReceitaMensal() {
  const db = createAdminClient();
  const { data } = await db
    .from("payments")
    .select("amount_cents, paid_at")
    .eq("status", "paid");

  return ultimos12Meses((p) => (data ?? [])
    .filter((x) => x.paid_at && mesmoMes(x.paid_at, p.ano, p.mesIdx))
    .reduce((s, x) => s + (x.amount_cents ?? 0), 0));
}

// ---- Novos assinantes por mês (12 meses) ----
export async function getNovosAssinantesMensal() {
  const db = createAdminClient();
  const { data } = await db.from("profiles").select("created_at");
  return ultimos12Meses((p) => (data ?? [])
    .filter((x) => x.created_at && mesmoMes(x.created_at, p.ano, p.mesIdx))
    .length);
}

// ---- Top livros por leitura ----
export async function getTopLivros(limite = 5) {
  const db = createAdminClient();
  const { data } = await db
    .from("reading_progress")
    .select("book_id, books(titulo)");
  const contagem = new Map<string, number>();
  (data ?? []).forEach((r: any) => {
    const t = r.books?.titulo;
    if (t) contagem.set(t, (contagem.get(t) ?? 0) + 1);
  });
  return Array.from(contagem.entries())
    .map(([titulo, leituras]) => ({ titulo, leituras }))
    .sort((a, b) => b.leituras - a.leituras)
    .slice(0, limite);
}

// ---- Origem das vendas ----
export async function getOrigemVendas() {
  const db = createAdminClient();
  const { data } = await db.from("profiles").select("origem");
  const total = (data ?? []).length;
  if (!total) return [];
  const contagem = new Map<string, number>();
  (data ?? []).forEach((r) => {
    const o = r.origem || "Não informado";
    contagem.set(o, (contagem.get(o) ?? 0) + 1);
  });
  return Array.from(contagem.entries())
    .map(([origem, n]) => ({ origem, pct: Math.round((n / total) * 100) }))
    .sort((a, b) => b.pct - a.pct);
}

// ---- Lista de clientes ----
export async function getClientes(): Promise<Cliente[]> {
  const db = createAdminClient();
  const { data } = await db
    .from("admin_clientes")
    .select("*")
    .order("entrou_em", { ascending: false });
  return (data ?? []).map(mapCliente);
}

export async function getNaoRenovaram(): Promise<Cliente[]> {
  const todos = await getClientes();
  return todos.filter((c) => c.status === "canceled" || c.status === "past_due");
}

function mapCliente(r: any): Cliente {
  return {
    id: r.id,
    nome: r.nome || (r.email ? r.email.split("@")[0] : "—"),
    email: r.email ?? "",
    status: (r.status ?? "inactive") as StatusAssinatura,
    entrouEm: fmtData(r.entrou_em),
    ultimaAtividade: fmtData(r.ultima_atividade),
    proximaCobranca:
      r.status === "canceled" && r.canceled_at
        ? `Cancelou em ${fmtData(r.canceled_at)}`
        : fmtData(r.current_period_end),
    meses: mesesEntre(r.entrou_em),
    motivo: r.cancel_reason ?? undefined,
  };
}

// ---- Helpers de mês ----
function mesmoMes(iso: string, ano: number, mesIdx: number): boolean {
  const d = new Date(iso);
  return d.getFullYear() === ano && d.getMonth() === mesIdx;
}

function ultimos12Meses<T extends number>(
  valor: (p: { ano: number; mesIdx: number }) => T
): { mes: string; valor: T }[] {
  const out: { mes: string; valor: T }[] = [];
  const hoje = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    out.push({
      mes: MES_ABREV[d.getMonth()],
      valor: valor({ ano: d.getFullYear(), mesIdx: d.getMonth() }),
    });
  }
  return out;
}
