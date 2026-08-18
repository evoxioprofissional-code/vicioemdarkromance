// ============================================================
//  DADOS DO PAINEL ADMIN — PROTÓTIPO VISUAL (tudo fictício)
//  Nenhuma integração real: números, clientes e vendas são mock.
// ============================================================

const PRECO = 9.99;

/** Formata número para moeda BRL (ex.: 12827 -> "R$ 12.827,00"). */
export function brl(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** Formata número curto (ex.: 12827 -> "12,8 mil"). */
export function compacto(valor: number): string {
  if (valor >= 1000) return (valor / 1000).toFixed(1).replace(".", ",") + " mil";
  return String(valor);
}

// ---------- KPIs principais da dashboard ----------
export const assinantesAtivos = 1284;

export const kpis = {
  mrr: Math.round(assinantesAtivos * PRECO), // receita recorrente mensal
  receitaMes: 15980, // faturamento do mês corrente (novas + renovações)
  receitaAcumulada: 142310, // no ano
  assinantesAtivos,
  novos30d: 208,
  cancelados30d: 61,
  churn: 4.7, // %
  ticketMedio: PRECO,
  ltv: 61.4, // valor médio por cliente
};

// ---------- Série de receita (últimos 12 meses) ----------
export const receitaMensal: { mes: string; valor: number }[] = [
  { mes: "Set", valor: 4120 },
  { mes: "Out", valor: 5380 },
  { mes: "Nov", valor: 6740 },
  { mes: "Dez", valor: 8210 },
  { mes: "Jan", valor: 9060 },
  { mes: "Fev", valor: 9880 },
  { mes: "Mar", valor: 10720 },
  { mes: "Abr", valor: 11540 },
  { mes: "Mai", valor: 12310 },
  { mes: "Jun", valor: 13480 },
  { mes: "Jul", valor: 14690 },
  { mes: "Ago", valor: 15980 },
];

// ---------- Novos assinantes por mês ----------
export const novosAssinantes: { mes: string; valor: number }[] = [
  { mes: "Set", valor: 96 },
  { mes: "Out", valor: 128 },
  { mes: "Nov", valor: 141 },
  { mes: "Dez", valor: 167 },
  { mes: "Jan", valor: 133 },
  { mes: "Fev", valor: 152 },
  { mes: "Mar", valor: 174 },
  { mes: "Abr", valor: 161 },
  { mes: "Mai", valor: 158 },
  { mes: "Jun", valor: 189 },
  { mes: "Jul", valor: 201 },
  { mes: "Ago", valor: 208 },
];

// ---------- Origem das vendas ----------
export const origemVendas: { origem: string; pct: number }[] = [
  { origem: "Instagram", pct: 42 },
  { origem: "TikTok", pct: 27 },
  { origem: "Indicação", pct: 16 },
  { origem: "Google", pct: 9 },
  { origem: "Outros", pct: 6 },
];

// ---------- Top livros mais lidos (engajamento) ----------
export const topLivros: { titulo: string; leituras: number }[] = [
  { titulo: "Assombrando Adeline", leituras: 3120 },
  { titulo: "Perseguindo Adeline", leituras: 2870 },
  { titulo: "Cutelo & Corvo", leituras: 2410 },
  { titulo: "Desenfreados", leituras: 2180 },
  { titulo: "Insatiable", leituras: 1740 },
];

// ---------- Clientes ----------
export type StatusCliente = "ativo" | "inadimplente" | "cancelado";

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  status: StatusCliente;
  entrouEm: string; // data de assinatura
  ultimaAtividade: string;
  proximaCobranca: string; // ou data do cancelamento
  meses: number; // tempo de casa
  motivo?: string; // por que não renovou (se aplicável)
}

export const clientes: Cliente[] = [
  {
    id: "c1",
    nome: "Marina Oliveira",
    email: "marina.oliveira@email.com",
    status: "ativo",
    entrouEm: "12/01/2026",
    ultimaAtividade: "Hoje, 19:04",
    proximaCobranca: "12/09/2026",
    meses: 7,
  },
  {
    id: "c2",
    nome: "Bruna Rezende",
    email: "bruna.rez@email.com",
    status: "ativo",
    entrouEm: "03/02/2026",
    ultimaAtividade: "Ontem",
    proximaCobranca: "03/09/2026",
    meses: 6,
  },
  {
    id: "c3",
    nome: "Larissa Meireles",
    email: "lari.meireles@email.com",
    status: "ativo",
    entrouEm: "21/11/2025",
    ultimaAtividade: "Há 3 dias",
    proximaCobranca: "21/08/2026",
    meses: 9,
  },
  {
    id: "c4",
    nome: "Camila Tavares",
    email: "camila.t@email.com",
    status: "inadimplente",
    entrouEm: "08/03/2026",
    ultimaAtividade: "Há 8 dias",
    proximaCobranca: "08/08/2026",
    meses: 5,
    motivo: "Falha no cartão",
  },
  {
    id: "c5",
    nome: "Patrícia Nunes",
    email: "paty.nunes@email.com",
    status: "ativo",
    entrouEm: "17/04/2026",
    ultimaAtividade: "Hoje, 11:20",
    proximaCobranca: "17/09/2026",
    meses: 4,
  },
  {
    id: "c6",
    nome: "Fernanda Lopes",
    email: "fe.lopes@email.com",
    status: "cancelado",
    entrouEm: "05/10/2025",
    ultimaAtividade: "Há 22 dias",
    proximaCobranca: "Cancelou em 22/07/2026",
    meses: 9,
    motivo: "Sem tempo para ler",
  },
  {
    id: "c7",
    nome: "Juliana Prado",
    email: "ju.prado@email.com",
    status: "ativo",
    entrouEm: "29/05/2026",
    ultimaAtividade: "Há 1 dia",
    proximaCobranca: "29/08/2026",
    meses: 3,
  },
  {
    id: "c8",
    nome: "Amanda Ferreira",
    email: "amanda.f@email.com",
    status: "cancelado",
    entrouEm: "14/12/2025",
    ultimaAtividade: "Há 15 dias",
    proximaCobranca: "Cancelou em 29/07/2026",
    meses: 7,
    motivo: "Preço",
  },
  {
    id: "c9",
    nome: "Roberta Dias",
    email: "roberta.dias@email.com",
    status: "inadimplente",
    entrouEm: "02/06/2026",
    ultimaAtividade: "Há 6 dias",
    proximaCobranca: "02/08/2026",
    meses: 2,
    motivo: "Cartão expirado",
  },
  {
    id: "c10",
    nome: "Tatiane Rocha",
    email: "tati.rocha@email.com",
    status: "ativo",
    entrouEm: "19/07/2026",
    ultimaAtividade: "Hoje, 08:47",
    proximaCobranca: "19/08/2026",
    meses: 1,
  },
];

export const naoRenovaram = clientes.filter(
  (c) => c.status === "cancelado" || c.status === "inadimplente"
);
