import { DocHeader } from "@/components/PageChrome";

export const metadata = { title: "Como ler os livros — Vício em Dark Romance" };

export default function ComoLerPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Ajuda"
        titulo="Como ler os livros"
        intro="A leitura é direto na plataforma, pelo navegador — no celular, tablet ou computador. Simples assim."
      />
      <div className="prose-dark">
        <h2>Onde encontrar seus livros</h2>
        <p>
          Depois de entrar na sua conta, vá em <a href="/plataforma">Minha
          Biblioteca</a>, abra o livro que quiser e toque em{" "}
          <strong>Ler agora</strong>. O livro abre na hora, sem precisar instalar
          nada.
        </p>

        <h2>No celular ou tablet</h2>
        <p>
          É só abrir o site no navegador (Chrome, Safari…), entrar com a sua conta
          e tocar em <strong>Ler agora</strong>. A leitura acontece dentro do
          próprio navegador — nada de baixar arquivos.
        </p>

        <h2>No computador</h2>
        <p>
          Funciona igual: acesse o site em qualquer navegador (Chrome, Edge,
          Firefox), entre e abra o livro para ler em tela cheia.
        </p>

        <h2>Boas práticas</h2>
        <ul>
          <li>Precisa estar com a assinatura ativa e conectada à internet para ler.</li>
          <li>O conteúdo é de uso pessoal e exclusivo de assinantes — não compartilhe seu acesso. Isso ajuda o clube a seguir trazendo novos títulos. 🖤</li>
        </ul>

        <p>
          Ficou com dúvida? Chama a gente em <a href="/contato">Fale conosco</a>.
        </p>
      </div>
    </article>
  );
}
