// Plano de assinatura (oferta única). Preço de venda: R$ 9,99/mês.

export interface Plano {
  id: string;
  nome: string;
  periodo: string;
  precoMes: string; // exibido como "por mês"
  cobranca: string; // texto da cobrança
  economia?: string;
  destaque?: boolean;
  beneficios: string[];
}

export const planos: Plano[] = [
  {
    id: "mensal",
    nome: "Acesso Total",
    periodo: "1 mês",
    precoMes: "R$ 9,99",
    cobranca: "Cobrança mensal de R$ 9,99 · sem fidelidade",
    destaque: true,
    beneficios: [
      "Biblioteca completa liberada na hora",
      "Novos títulos de dark romance todo mês",
      "Leitura na plataforma e download em PDF",
      "Todas as coleções e lançamentos inclusos",
      "Leia em qualquer aparelho, onde quiser",
      "Cancele quando quiser, sem multa",
    ],
  },
];

export function getPlano(_id?: string): Plano {
  // Oferta única: sempre retorna o mesmo plano.
  return planos[0];
}
