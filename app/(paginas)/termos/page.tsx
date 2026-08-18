import { DocHeader } from "@/components/PageChrome";

export const metadata = { title: "Termos de Uso — Vício em Dark Romance" };

export default function TermosPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Legal"
        titulo="Termos de Uso"
        atualizado="18 de agosto de 2026"
        intro="Estas condições regem o uso do clube de assinatura Vício em Dark Romance. Ao criar sua conta e assinar, você concorda com tudo o que está aqui."
      />
      <div className="prose-dark">
        <h2>1. Quem somos e o que oferecemos</h2>
        <p>
          O <strong>Vício em Dark Romance</strong> é um clube por assinatura que
          dá acesso a uma biblioteca digital de livros de dark romance em PDF,
          com novos títulos disponibilizados periodicamente. O acesso é pessoal
          e válido enquanto a assinatura estiver ativa.
        </p>

        <h2>2. Idade mínima (+18)</h2>
        <p>
          O acervo contém conteúdo adulto, com cenas sensuais e temas maduros.
          Ao assinar, você declara ter <strong>18 anos ou mais</strong> e estar
          ciente da natureza do conteúdo. Não permitimos o uso por menores de
          idade.
        </p>

        <h2>3. Sua conta</h2>
        <p>
          Você é responsável por manter a confidencialidade do seu login e por
          toda atividade realizada na sua conta. Informe-nos imediatamente caso
          suspeite de acesso indevido. Cada assinatura é individual e
          intransferível.
        </p>

        <h2>4. Assinatura e pagamento</h2>
        <ul>
          <li>A assinatura é mensal, cobrada de forma recorrente pelo valor vigente no momento da contratação.</li>
          <li>O acesso à biblioteca é liberado após a confirmação do pagamento.</li>
          <li>Você pode cancelar quando quiser — não há fidelidade nem multa. Ao cancelar, o acesso permanece até o fim do período já pago.</li>
          <li>Eventuais reajustes de preço serão comunicados com antecedência e valerão apenas para os ciclos seguintes.</li>
        </ul>

        <h2>5. Uso permitido</h2>
        <p>
          Os arquivos são disponibilizados para <strong>leitura pessoal</strong>.
          É expressamente proibido copiar, revender, compartilhar, distribuir,
          publicar ou disponibilizar os PDFs a terceiros, no todo ou em parte,
          por qualquer meio. Cada arquivo pode conter marcações de identificação.
        </p>

        <h2>6. Propriedade intelectual</h2>
        <p>
          Todo o conteúdo, marca, layout e materiais do clube são protegidos por
          direitos autorais e pertencem ao Vício em Dark Romance ou a seus
          licenciantes. A assinatura concede um direito limitado de acesso, não
          de propriedade.
        </p>

        <h2>7. Suspensão e encerramento</h2>
        <p>
          Podemos suspender ou encerrar o acesso, sem reembolso, em caso de
          violação destes termos — especialmente o compartilhamento indevido de
          arquivos.
        </p>

        <h2>8. Alterações</h2>
        <p>
          Estes termos podem ser atualizados a qualquer momento. A versão vigente
          é sempre a publicada nesta página, com a data de atualização no topo.
        </p>

        <h2>9. Contato</h2>
        <p>
          Dúvidas sobre estes termos? Fale com a gente pela página{" "}
          <a href="/contato">Fale conosco</a>.
        </p>
      </div>
    </article>
  );
}
