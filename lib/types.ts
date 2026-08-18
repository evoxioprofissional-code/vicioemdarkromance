// ============================================================
//  Tipos e helpers puros (sem dados mockados).
//  Os dados reais vêm do Supabase via lib/queries/*.
// ============================================================

export type Categoria =
  | "Máfia Romance"
  | "Inimigos para Amantes"
  | "Dark & Forbidden"
  | "Bilionário Sombrio"
  | "Motoqueiros"
  | "Vingança"
  | "Possessivo"
  | "Sobrenatural";

export const categorias: Categoria[] = [
  "Máfia Romance",
  "Inimigos para Amantes",
  "Dark & Forbidden",
  "Bilionário Sombrio",
  "Motoqueiros",
  "Vingança",
  "Possessivo",
  "Sobrenatural",
];

// Formato de livro usado pelos componentes (mapeado a partir da linha do banco).
export interface Livro {
  id: string; // = slug
  titulo: string;
  autora: string;
  tags: Categoria[];
  sinopse: string;
  paginas: number;
  ano: number;
  nota: number;
  novo?: boolean;
  destaque?: boolean;
  lancadoEm?: string;
  coverUrl?: string; // imagem de capa enviada (opcional)
  temPdf?: boolean; // há arquivo PDF disponível
  capa: { de: string; para: string; selo: string };
}

// Linha crua da tabela public.books
export interface BookRow {
  id: string;
  slug: string;
  titulo: string;
  autora: string;
  sinopse: string | null;
  paginas: number | null;
  ano: number | null;
  nota: number | string | null;
  tags: string[] | null;
  capa_de: string | null;
  capa_para: string | null;
  selo: string | null;
  cover_path: string | null;
  pdf_path: string | null;
  destaque: boolean | null;
  novo: boolean | null;
  lancado_em: string | null;
}

export function rowToLivro(r: BookRow, coverUrl?: string): Livro {
  return {
    id: r.slug,
    titulo: r.titulo,
    autora: r.autora,
    tags: (r.tags ?? []) as Categoria[],
    sinopse: r.sinopse ?? "",
    paginas: r.paginas ?? 0,
    ano: r.ano ?? 0,
    nota: Number(r.nota ?? 0),
    novo: r.novo ?? undefined,
    destaque: r.destaque ?? undefined,
    lancadoEm: r.lancado_em ?? undefined,
    coverUrl,
    temPdf: !!r.pdf_path,
    capa: {
      de: r.capa_de ?? "#2a0510",
      para: r.capa_para ?? "#a11d2e",
      selo: r.selo ?? "",
    },
  };
}

// ---- Regra de "Novo Lançamento": 5 dias após o lançamento ----
export const JANELA_LANCAMENTO_DIAS = 5;

function diasDesde(iso: string): number {
  const d = new Date(iso + "T00:00:00");
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.floor((hoje.getTime() - d.getTime()) / 86_400_000);
}

export function diasRestantesLancamento(livro: Livro): number {
  if (!livro.lancadoEm) return 0;
  const restam = JANELA_LANCAMENTO_DIAS - diasDesde(livro.lancadoEm);
  return restam > 0 ? restam : 0;
}

export function emLancamento(livro: Livro): boolean {
  return diasRestantesLancamento(livro) > 0;
}

// ---- Planos ----
export interface Plano {
  id: string;
  nome: string;
  periodo: string;
  precoMes: string; // "R$ 9,99"
  cobranca: string;
  economia?: string;
  destaque?: boolean;
  beneficios: string[];
}

// ---- Clientes (admin) ----
export type StatusAssinatura =
  | "active"
  | "past_due"
  | "canceled"
  | "inactive";

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  status: StatusAssinatura;
  entrouEm: string;
  ultimaAtividade: string;
  proximaCobranca: string;
  meses: number;
  motivo?: string;
}

// ---- Utilidades de formatação ----
export function brl(valorCentavos: number): string {
  return (valorCentavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function brlReais(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
