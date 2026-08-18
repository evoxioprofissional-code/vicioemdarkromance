import { DocHeader } from "@/components/PageChrome";

export const metadata = { title: "Conteúdo +18 — Vício em Dark Romance" };

export default function ConteudoAdultoPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Aviso importante"
        titulo="Conteúdo Adulto · +18"
        intro="O Vício em Dark Romance é um clube para pessoas adultas. Antes de mergulhar, entenda o que você vai encontrar aqui."
      />
      <div className="prose-dark">
        <h2>O que é dark romance</h2>
        <p>
          Dark romance é um subgênero da literatura romântica que explora
          relações intensas, temas moralmente ambíguos e cenas sensuais
          explícitas. Nossos títulos podem conter linguagem adulta, violência,
          possessividade, obsessão e outros temas sensíveis.
        </p>

        <h2>Confirmação de idade</h2>
        <p>
          Ao criar sua conta e assinar, você declara ter{" "}
          <strong>18 anos ou mais</strong> e concorda em acessar conteúdo adulto
          por vontade própria. Este clube não é destinado a menores de idade.
        </p>

        <h2>Leitura consciente</h2>
        <ul>
          <li>Alguns enredos abordam temas que podem ser desconfortáveis para parte das leitoras.</li>
          <li>Sempre que possível, indicamos os principais temas de cada livro nas suas categorias.</li>
          <li>Leia no seu ritmo e respeite seus próprios limites — é ficção, feita para o prazer da leitura.</li>
        </ul>

        <h2>Responsabilidade</h2>
        <p>
          O conteúdo é destinado exclusivamente ao uso pessoal de assinantes
          adultos. Mantenha seus arquivos fora do alcance de menores e não
          compartilhe seu acesso.
        </p>
      </div>
    </article>
  );
}
