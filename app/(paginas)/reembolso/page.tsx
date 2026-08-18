import { DocHeader } from "@/components/PageChrome";

export const metadata = { title: "Política de Reembolso — Vício em Dark Romance" };

export default function ReembolsoPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Legal"
        titulo="Política de Reembolso"
        atualizado="18 de agosto de 2026"
        intro="Sem pegadinha: se não rolou química, a gente resolve. Veja como funciona o reembolso e o cancelamento."
      />
      <div className="prose-dark">
        <h2>Direito de arrependimento (7 dias)</h2>
        <p>
          Por se tratar de uma contratação on-line, você tem direito ao
          arrependimento em até <strong>7 dias corridos</strong> a partir da
          confirmação do pagamento, conforme o art. 49 do Código de Defesa do
          Consumidor. Nesse período, devolvemos <strong>100% do valor</strong> da
          primeira assinatura.
        </p>

        <h2>Como solicitar</h2>
        <ul>
          <li>Acesse <a href="/contato">Fale conosco</a> e peça o reembolso, informando o e-mail da sua conta.</li>
          <li>Confirmamos a solicitação e iniciamos o estorno.</li>
          <li>O acesso é encerrado no momento do reembolso.</li>
        </ul>

        <h2>Prazo do estorno</h2>
        <p>
          O estorno é feito pelo mesmo meio de pagamento. No <strong>Pix</strong>,
          costuma cair em poucos dias úteis; no <strong>cartão de crédito</strong>,
          o valor aparece na fatura conforme os prazos da operadora.
        </p>

        <h2>Renovações mensais</h2>
        <p>
          Após os 7 dias iniciais, as mensalidades já usufruídas não são
          reembolsáveis. Mas você pode <strong>cancelar quando quiser</strong>: ao
          cancelar, não há novas cobranças e o acesso continua até o fim do
          período já pago. Sem multa, sem fidelidade.
        </p>

        <h2>Cobrança que você não reconhece?</h2>
        <p>
          Se identificar um débito estranho, fale com a gente imediatamente pela
          página <a href="/contato">Fale conosco</a> que investigamos e
          resolvemos.
        </p>
      </div>
    </article>
  );
}
