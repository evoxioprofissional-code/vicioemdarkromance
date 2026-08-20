"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const PERGUNTAS = [
  {
    q: "Como funciona a assinatura?",
    a: "Você escolhe um plano, cria sua conta e ganha acesso imediato à biblioteca completa. Novos títulos entram todo mês e ficam disponíveis enquanto sua assinatura estiver ativa.",
  },
  {
    q: "Como leio os livros?",
    a: "Cada título é lido direto na plataforma — no celular, tablet ou computador, pelo navegador. É só entrar com a sua conta e abrir o livro, onde e quando quiser.",
  },
  {
    q: "Quantos livros posso ler por mês?",
    a: "Todos. Não há limite de leitura: a biblioteca inteira fica liberada durante toda a vigência do seu plano, sem cobrança por título.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Claro. Não há fidelidade nem multa. Você gerencia ou cancela sua assinatura em poucos cliques na sua conta, e continua com acesso até o fim do período pago.",
  },
  {
    q: "O conteúdo é adulto?",
    a: "Sim. Nosso acervo é de dark romance com cenas sensuais e temas maduros, destinado a maiores de 18 anos. Ao assinar, você confirma ter idade legal para o conteúdo.",
  },
  {
    q: "É seguro pagar no site?",
    a: "Sim. O pagamento é criptografado e processado por gateways certificados, com os mesmos padrões de segurança usados pelos maiores sites do mundo.",
  },
];

export default function FAQ() {
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-white/5">
      {PERGUNTAS.map((item, i) => {
        const open = aberta === i;
        return (
          <div key={i}>
            <button
              onClick={() => setAberta(open ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span
                className={`font-display text-lg transition-colors ${
                  open ? "text-white" : "text-white/80"
                }`}
              >
                {item.q}
              </span>
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 transition-all duration-300 ${
                  open
                    ? "rotate-45 bg-blood-800/40 ring-champagne/40 text-champagne"
                    : "ring-white/10 text-white/50"
                }`}
              >
                <Plus size={16} />
              </span>
            </button>
            <div
              className="grid overflow-hidden transition-all duration-400"
              style={{
                gridTemplateRows: open ? "1fr" : "0fr",
                opacity: open ? 1 : 0,
              }}
            >
              <div className="min-h-0">
                <p className="pb-5 pr-12 text-sm leading-relaxed text-white/55">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
