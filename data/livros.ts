// ============================================================
//  DADOS FICTÍCIOS — PROTÓTIPO VISUAL
//  Todos os títulos, autoras, sinopses e categorias são
//  inventados apenas para demonstração. Nenhuma obra real.
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

export interface Livro {
  id: string;
  titulo: string;
  autora: string;
  tags: Categoria[];
  sinopse: string;
  paginas: number;
  ano: number;
  nota: number; // 0–5
  novo?: boolean;
  destaque?: boolean;
  lancadoEm?: string; // ISO (yyyy-mm-dd) — usado na regra de "novo lançamento"
  // Par de cores para a "capa" gerada via CSS (do escuro ao vibrante)
  capa: {
    de: string;
    para: string;
    // rótulo pequeno impresso na capa (subtítulo/coleção)
    selo: string;
  };
}

export const livros: Livro[] = [
  {
    id: "desenfreados",
    titulo: "Desenfreados",
    autora: "Kelly M.",
    tags: ["Máfia Romance", "Possessivo"],
    sinopse:
      "Ela foi prometida ao chefão como pagamento de uma dívida de sangue. Ele jurou nunca amar — mas ninguém foge do que já pertence à família.",
    paginas: 748,
    ano: 2024,
    nota: 4.8,
    novo: true,
    destaque: true,
    lancadoEm: "2026-08-13",
    capa: { de: "#3a0810", para: "#c0303f", selo: "Edição especial" },
  },
  {
    id: "perseguindo-adeline",
    titulo: "Perseguindo Adeline",
    autora: "H. D. Carlton",
    tags: ["Inimigos para Amantes", "Vingança"],
    sinopse:
      "Ela se aproximou para destruí-lo. Ele percebeu tarde demais que já a queria por perto — mesmo sabendo que ela seria sua ruína.",
    paginas: 587,
    ano: 2024,
    nota: 4.6,
    novo: true,
    lancadoEm: "2026-08-12",
    capa: { de: "#2a0510", para: "#a11d2e", selo: "Gato e Rato · Vol. II" },
  },
  {
    id: "assombrando-adeline",
    titulo: "Assombrando Adeline",
    autora: "H. D. Carlton",
    tags: ["Bilionário Sombrio", "Possessivo"],
    sinopse:
      "Ele comprou o hotel, a cidade e o silêncio dela. O que não conseguiu comprar foi o direito de esquecê-la ao amanhecer.",
    paginas: 635,
    ano: 2023,
    nota: 4.7,
    destaque: true,
    capa: { de: "#1a0a04", para: "#d9b26a", selo: "Gato e Rato · Vol. I" },
  },
  {
    id: "garotos-crueis-perseguem-voce",
    titulo: "Garotos Cruéis Perseguem Você",
    autora: "Red R",
    tags: ["Motoqueiros", "Dark & Forbidden"],
    sinopse:
      "O clube tinha regras, e a primeira era não tocar na filha do presidente. Ele quebrou todas na mesma noite de chuva.",
    paginas: 719,
    ano: 2024,
    nota: 4.5,
    novo: true,
    lancadoEm: "2026-08-11",
    capa: { de: "#20060a", para: "#7a0f1c", selo: "Red R · Vol. III" },
  },
  {
    id: "cutelo-e-corvo",
    titulo: "Cutelo & Corvo",
    autora: "Brynne Weaver",
    tags: ["Máfia Romance", "Dark & Forbidden"],
    sinopse:
      "Ela testemunhou o que não devia. A única forma de continuar viva era pertencer ao homem que puxou o gatilho.",
    paginas: 318,
    ano: 2023,
    nota: 4.9,
    destaque: true,
    capa: { de: "#2a0510", para: "#5c0a14", selo: "Amor Ruinoso · Vol. I" },
  },
  {
    id: "garotas-crueis-merecem-pagar",
    titulo: "Garotas Cruéis Merecem Pagar",
    autora: "Red R",
    tags: ["Vingança", "Inimigos para Amantes"],
    sinopse:
      "Sete anos planejando a queda dele. Um único olhar para lembrar por que o odiava — e por que nunca conseguiu parar de desejá-lo.",
    paginas: 595,
    ano: 2024,
    nota: 4.4,
    novo: true,
    lancadoEm: "2026-08-09",
    capa: { de: "#12060a", para: "#c0303f", selo: "Red R · Vol. I" },
  },
  {
    id: "insatiable",
    titulo: "Insatiable",
    autora: "Leigh Rivers",
    tags: ["Dark & Forbidden", "Possessivo"],
    sinopse:
      "Ele deveria salvá-la da tentação. Em vez disso, tornou-se o pecado que ela repetia toda noite em oração.",
    paginas: 250,
    ano: 2023,
    nota: 4.7,
    capa: { de: "#0f0608", para: "#a11d2e", selo: "Windsor · Vol. I" },
  },
  {
    id: "herdeira-do-fogo",
    titulo: "Herdeira do Fogo",
    autora: "Marina Kess",
    tags: ["Máfia Romance", "Vingança"],
    sinopse:
      "Mataram o pai dela e deram o império a ele. Ela voltou não para reaver o trono — mas para queimá-lo junto com o rei.",
    paginas: 455,
    ano: 2024,
    nota: 4.8,
    capa: { de: "#26070c", para: "#d94452", selo: "Duologia Belladonna" },
  },
  {
    id: "contrato-de-meia-noite",
    titulo: "Contrato de Meia-Noite",
    autora: "Cora Bane",
    tags: ["Bilionário Sombrio", "Inimigos para Amantes"],
    sinopse:
      "Doze meses, uma aliança falsa e uma cláusula proibida: não se apaixonar. Nenhum dos dois leu as letras miúdas.",
    paginas: 368,
    ano: 2023,
    nota: 4.5,
    capa: { de: "#1a0a04", para: "#b8914c", selo: "Coleção Midas" },
  },
  {
    id: "presa-favorita",
    titulo: "Presa Favorita",
    autora: "Selene Ravn",
    tags: ["Possessivo", "Dark & Forbidden"],
    sinopse:
      "Ele a deixou fugir só pela emoção da caçada. O erro foi deixá-la perceber que gostava de ser encontrada.",
    paginas: 331,
    ano: 2024,
    nota: 4.3,
    novo: true,
    lancadoEm: "2026-08-10",
    capa: { de: "#14060a", para: "#7a0f1c", selo: "Standalone" },
  },
  {
    id: "cinzas-de-um-rei",
    titulo: "Cinzas de um Rei",
    autora: "Helena Voss",
    tags: ["Máfia Romance", "Vingança"],
    sinopse:
      "A guerra entre as famílias tinha um único termo de paz: o casamento deles. Ninguém avisou que o amor também mata.",
    paginas: 447,
    ano: 2022,
    nota: 4.6,
    capa: { de: "#2a0510", para: "#a11d2e", selo: "Império Corvi · Vol. III" },
  },
  {
    id: "luar-carmesim",
    titulo: "Luar Carmesim",
    autora: "Dahlia Crowe",
    tags: ["Sobrenatural", "Dark & Forbidden"],
    sinopse:
      "Ela cruzou o pacto que selava a cidade. Do outro lado, ele esperava há um século — faminto por ela e apenas por ela.",
    paginas: 398,
    ano: 2024,
    nota: 4.4,
    capa: { de: "#0a0810", para: "#8a2f6a", selo: "Ordem da Noite" },
  },
  {
    id: "a-divida",
    titulo: "A Dívida",
    autora: "Marina Kess",
    tags: ["Máfia Romance", "Possessivo"],
    sinopse:
      "O irmão dela apostou o que não tinha. O pagamento veio em forma de um contrato — e do homem que passou a chamá-la de sua.",
    paginas: 372,
    ano: 2023,
    nota: 4.7,
    capa: { de: "#20060a", para: "#c0303f", selo: "Standalone" },
  },
  {
    id: "reféns-do-desejo",
    titulo: "Reféns do Desejo",
    autora: "Cora Bane",
    tags: ["Inimigos para Amantes", "Motoqueiros"],
    sinopse:
      "Sequestrada por engano, ela virou moeda de troca entre dois clubes. E o único que a protegia era o que mais deveria temer.",
    paginas: 355,
    ano: 2024,
    nota: 4.2,
    novo: true,
    lancadoEm: "2026-08-12",
    capa: { de: "#14060a", para: "#d94452", selo: "Ferro & Cinzas MC" },
  },
  {
    id: "senhor-da-tempestade",
    titulo: "Senhor da Tempestade",
    autora: "Ísis Marlowe",
    tags: ["Bilionário Sombrio", "Possessivo"],
    sinopse:
      "Ele controla mercados com um telefonema e pessoas com um olhar. Ela foi a primeira variável que ele não conseguiu prever.",
    paginas: 421,
    ano: 2022,
    nota: 4.6,
    capa: { de: "#1a0a04", para: "#d9b26a", selo: "Coleção Midas" },
  },
  {
    id: "oracao-para-um-monstro",
    titulo: "Oração para um Monstro",
    autora: "Dahlia Crowe",
    tags: ["Dark & Forbidden", "Vingança"],
    sinopse:
      "Disseram que ele era um monstro. Ela concordou — logo depois de decidir que seria a única a domá-lo.",
    paginas: 409,
    ano: 2024,
    nota: 4.8,
    destaque: true,
    capa: { de: "#12060a", para: "#a11d2e", selo: "Trilogia Ígnea" },
  },
];

// ---- Categorias para as prateleiras da plataforma ----
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

// ---- Helpers ----
export function getLivro(id: string): Livro | undefined {
  return livros.find((l) => l.id === id);
}

export function livrosPorCategoria(cat: Categoria): Livro[] {
  return livros.filter((l) => l.tags.includes(cat));
}

export function lancamentos(): Livro[] {
  return livros.filter((l) => l.novo);
}

export function maisLidos(): Livro[] {
  return [...livros].sort((a, b) => b.nota - a.nota).slice(0, 8);
}

export function relacionados(livro: Livro, limite = 4): Livro[] {
  return livros
    .filter((l) => l.id !== livro.id && l.tags.some((t) => livro.tags.includes(t)))
    .slice(0, limite);
}

// ---- Regra de "Novo Lançamento" ----
// Um título fica na vitrine de Novos Lançamentos por 5 dias após a publicação;
// depois sai automaticamente. (No protótipo, "hoje" é fixo p/ demonstração.)
export const JANELA_LANCAMENTO_DIAS = 5;
const HOJE = new Date("2026-08-13T00:00:00");

function diasDesde(iso: string): number {
  const d = new Date(iso + "T00:00:00");
  return Math.floor((HOJE.getTime() - d.getTime()) / 86_400_000);
}

/** Dias restantes na vitrine de lançamentos (0 = já saiu / não aplicável). */
export function diasRestantesLancamento(livro: Livro): number {
  if (!livro.lancadoEm) return 0;
  const restam = JANELA_LANCAMENTO_DIAS - diasDesde(livro.lancadoEm);
  return restam > 0 ? restam : 0;
}

/** Está atualmente em destaque como novo lançamento? */
export function emLancamento(livro: Livro): boolean {
  return diasRestantesLancamento(livro) > 0;
}
