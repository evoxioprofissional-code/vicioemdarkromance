import { DocHeader } from "@/components/PageChrome";

export const metadata = { title: "Como ler os PDFs — Vício em Dark Romance" };

export default function ComoLerPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Ajuda"
        titulo="Como ler os PDFs"
        intro="Cada livro pode ser lido direto na plataforma ou baixado em PDF para ler onde e quando quiser — inclusive offline."
      />
      <div className="prose-dark">
        <h2>Onde encontrar seus livros</h2>
        <p>
          Depois de entrar na sua conta, vá em <a href="/plataforma">Minha
          Biblioteca</a>, abra o livro que quiser e escolha entre{" "}
          <strong>Ler agora</strong> (na plataforma) ou{" "}
          <strong>Baixar PDF</strong> (para o seu aparelho).
        </p>

        <h2>No celular ou tablet</h2>
        <ul>
          <li><strong>Android:</strong> o PDF abre no leitor do próprio aparelho, no Google Drive/Arquivos ou em apps como Librera e ReadEra.</li>
          <li><strong>iPhone/iPad:</strong> abra no app Arquivos ou no Apple Books — é só tocar em “Abrir no Livros”.</li>
        </ul>

        <h2>No computador</h2>
        <p>
          Qualquer navegador (Chrome, Edge, Firefox) abre PDFs direto. Para uma
          leitura mais confortável, use o Adobe Acrobat Reader (grátis) ou o leitor
          nativo do seu sistema.
        </p>

        <h2>No e-reader (Kindle, Kobo)</h2>
        <ul>
          <li><strong>Kindle:</strong> envie o PDF por e-mail usando o recurso “Enviar para Kindle” ou conecte via cabo e copie o arquivo.</li>
          <li><strong>Kobo:</strong> conecte no computador e arraste o PDF para a pasta de documentos.</li>
        </ul>

        <h2>Dicas rápidas</h2>
        <ul>
          <li>Baixou uma vez, leu quantas vezes quiser — mesmo sem internet.</li>
          <li>Os arquivos são para uso pessoal. Não compartilhe: além de ser proibido, isso ajuda o clube a seguir trazendo novos títulos.</li>
        </ul>

        <p>
          Ficou com dúvida? Chama a gente em <a href="/contato">Fale conosco</a>.
        </p>
      </div>
    </article>
  );
}
