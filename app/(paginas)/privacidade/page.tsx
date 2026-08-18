import { DocHeader } from "@/components/PageChrome";

export const metadata = { title: "Política de Privacidade — Vício em Dark Romance" };

export default function PrivacidadePage() {
  return (
    <article>
      <DocHeader
        eyebrow="Legal"
        titulo="Política de Privacidade"
        atualizado="18 de agosto de 2026"
        intro="Sua privacidade importa — ainda mais em um clube discreto como o nosso. Aqui explicamos, de forma clara, quais dados tratamos e por quê, seguindo a LGPD."
      />
      <div className="prose-dark">
        <h2>1. Dados que coletamos</h2>
        <ul>
          <li><strong>Cadastro:</strong> nome e e-mail informados na criação da conta.</li>
          <li><strong>Assinatura:</strong> status do plano e histórico de pagamentos (os dados do cartão/Pix são processados pelo gateway de pagamento — nós não armazenamos números de cartão).</li>
          <li><strong>Uso:</strong> progresso de leitura e preferências, para melhorar sua experiência.</li>
        </ul>

        <h2>2. Como usamos seus dados</h2>
        <ul>
          <li>Liberar e manter seu acesso à biblioteca.</li>
          <li>Processar cobranças e gerenciar a assinatura.</li>
          <li>Enviar comunicados importantes sobre a conta e lançamentos.</li>
          <li>Melhorar o acervo e o funcionamento do clube.</li>
        </ul>

        <h2>3. Base legal (LGPD)</h2>
        <p>
          Tratamos seus dados para a <strong>execução do contrato</strong> de
          assinatura, para o <strong>cumprimento de obrigações legais</strong> e,
          quando aplicável, mediante o seu <strong>consentimento</strong>.
        </p>

        <h2>4. Compartilhamento</h2>
        <p>
          Não vendemos seus dados. Compartilhamos apenas o necessário com
          prestadores essenciais — como o gateway de pagamento e a infraestrutura
          de hospedagem — que tratam os dados em nosso nome e sob confidencialidade.
        </p>

        <h2>5. Cookies</h2>
        <p>
          Usamos cookies essenciais para manter você logado e para o site
          funcionar. Não utilizamos cookies para publicidade de terceiros.
        </p>

        <h2>6. Seus direitos</h2>
        <p>
          Você pode solicitar acesso, correção, portabilidade ou exclusão dos
          seus dados, além de revogar consentimentos. Basta pedir pela página{" "}
          <a href="/contato">Fale conosco</a>.
        </p>

        <h2>7. Segurança e retenção</h2>
        <p>
          Adotamos medidas técnicas para proteger seus dados e os mantemos apenas
          pelo tempo necessário às finalidades acima ou conforme exigido por lei.
          Ao encerrar sua conta, os dados pessoais são eliminados ou anonimizados,
          ressalvadas as obrigações legais de guarda.
        </p>

        <h2>8. Contato</h2>
        <p>
          Para qualquer questão sobre privacidade, fale com a gente em{" "}
          <a href="/contato">Fale conosco</a>.
        </p>
      </div>
    </article>
  );
}
