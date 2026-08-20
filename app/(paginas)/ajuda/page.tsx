import Link from "next/link";
import { BookOpen, CreditCard, UserRound, LifeBuoy, ArrowRight } from "lucide-react";
import { DocHeader } from "@/components/PageChrome";

export const metadata = { title: "Central de ajuda — Vício em Dark Romance" };

const TOPICOS = [
  { icon: BookOpen, titulo: "Como ler os livros", desc: "Leitura direto na plataforma, no celular, tablet ou computador.", href: "/como-ler" },
  { icon: CreditCard, titulo: "Pagamento e reembolso", desc: "Cobrança, cancelamento e como pedir reembolso.", href: "/reembolso" },
  { icon: UserRound, titulo: "Minha conta", desc: "Acesso, assinatura e dados pessoais.", href: "/plataforma/conta" },
  { icon: LifeBuoy, titulo: "Fale conosco", desc: "Não achou o que procurava? A gente responde rápido.", href: "/contato" },
];

const FAQ = [
  { q: "Como funciona a assinatura?", a: "Você escolhe o plano, cria a conta e ganha acesso imediato à biblioteca completa. Novos títulos entram todo mês enquanto a assinatura estiver ativa." },
  { q: "Posso cancelar quando quiser?", a: "Sim. Sem fidelidade e sem multa — você continua com acesso até o fim do período já pago." },
  { q: "Onde consigo ler?", a: "Direto na plataforma, pelo navegador — no celular, tablet ou computador. Precisa de internet e da assinatura ativa." },
  { q: "O conteúdo é adulto?", a: "Sim, é dark romance com cenas sensuais e temas maduros, para maiores de 18 anos." },
];

export default function AjudaPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Ajuda"
        titulo="Central de ajuda"
        intro="Tudo que você precisa para aproveitar o clube. Escolha um tema ou dê uma olhada nas perguntas frequentes."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {TOPICOS.map((t) => (
          <Link key={t.titulo} href={t.href} className="glass group rounded-2xl p-5 transition-transform hover:-translate-y-1">
            <span className="mb-3 inline-grid h-11 w-11 place-items-center rounded-xl bg-blood-800/40 text-champagne ring-1 ring-champagne/20">
              <t.icon size={20} />
            </span>
            <h3 className="font-display text-lg font-semibold text-white">{t.titulo}</h3>
            <p className="mt-1 text-sm text-white/55">{t.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-champagne">
              Ver <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 mt-12 font-display text-2xl font-bold text-white">Perguntas frequentes</h2>
      <div className="divide-y divide-white/5">
        {FAQ.map((f) => (
          <div key={f.q} className="py-5">
            <h3 className="font-display text-lg text-white">{f.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-champagne/15 bg-blood-900/15 p-5 text-center">
        <p className="text-white/70">Ainda com dúvida?</p>
        <Link href="/contato" className="btn-primary mt-3 !py-2.5">Fale conosco</Link>
      </div>
    </article>
  );
}
