import Link from "next/link";
import {
  BookOpen,
  Download,
  Flame,
  Quote,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroMosaic from "@/components/HeroMosaic";
import BookCard from "@/components/BookCard";
import Planos from "@/components/Planos";
import FAQ from "@/components/FAQ";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/Section";
import { getCatalogo } from "@/lib/queries/books";
import { getPlano } from "@/lib/queries/plans";

const PROVAS = [
  { valor: "160+", label: "títulos na biblioteca" },
  { valor: "8", label: "novos livros por mês" },
  { valor: "12", label: "subgêneros de dark romance" },
  { valor: "24k", label: "leitoras viciadas" },
];

const PASSOS = [
  {
    icon: Flame,
    titulo: "Assine o clube",
    texto:
      "Escolha seu plano em segundos. Sem burocracia, sem fidelidade — só o proibido esperando por você.",
  },
  {
    icon: BookOpen,
    titulo: "Acesse a biblioteca",
    texto:
      "A estante inteira libera na hora: máfia, inimigos para amantes, dark & forbidden e muito mais.",
  },
  {
    icon: Download,
    titulo: "Leia onde quiser",
    texto:
      "Leia na plataforma ou baixe em PDF para o celular, tablet ou e-reader. Sua vontade não tem horário.",
  },
];

const DEPOIMENTOS = [
  {
    nome: "Bruna R.",
    tag: "assinante há 8 meses",
    texto:
      "Eu vim pelo primeiro livro e fiquei pelo vício. Todo mês tem lançamento novo e eu simplesmente não consigo parar de ler de madrugada.",
  },
  {
    nome: "Larissa M.",
    tag: "plano anual",
    texto:
      "Finalmente um lugar que entende do que eu gosto. As curadorias de máfia romance são absurdas, parece que leram minha mente.",
  },
  {
    nome: "Camila T.",
    tag: "leitora fundadora",
    texto:
      "Baixo os PDFs e leio no ônibus, na fila, antes de dormir. Melhor gasto de R$ 29 da minha vida — falo sem exagero nenhum.",
  },
];

export default async function LandingPage() {
  const catalogo = await getCatalogo();
  const previa = catalogo.slice(0, 10);
  const plano = await getPlano();

  return (
    <main className="relative overflow-x-hidden">
      <Header />

      {/* ================= HERO ================= */}
      <section className="relative pt-28 sm:pt-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-24">
          <div className="animate-fade-up">
            <span className="eyebrow">
              <span className="h-px w-6 bg-champagne/50" /> Clube de assinatura · +18
            </span>
            <h1 className="mt-5 font-display text-5xl font-black leading-[1.02] text-white sm:text-6xl md:text-7xl">
              O seu novo <span className="italic text-bloodied">vício</span> tem
              hora marcada:
              <span className="block text-gilded">toda noite.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
              Uma biblioteca inteira de <strong className="text-white/80">dark
              romance</strong> em PDF por uma assinatura mensal. Máfia, obsessão
              e amores proibidos — com títulos novos todo mês.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="#planos" className="btn-primary">
                Assinar agora <ArrowRight size={16} />
              </Link>
              <Link href="#catalogo" className="btn-ghost">
                Ver catálogo
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm text-white/45">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-champagne" /> Cancele quando quiser
              </span>
              <span className="h-4 w-px bg-white/15" />
              <span>Sem fidelidade</span>
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:150ms]">
            <HeroMosaic livros={catalogo} />
          </div>
        </div>

        {/* faixa de prova (números) */}
        <div className="border-y border-white/5 bg-ink-800/40 backdrop-blur-sm">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-5 py-8 sm:px-8 md:grid-cols-4">
            {PROVAS.map((p) => (
              <div key={p.label} className="text-center">
                <p className="font-display text-3xl font-extrabold text-gilded sm:text-4xl">
                  {p.valor}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/45">
                  {p.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CATÁLOGO (prévia) ================= */}
      <section id="catalogo" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Uma amostra do acervo"
            titulo="Livros que você não vai"
            destaque="conseguir largar"
            sub="Uma prévia da estante. Ao assinar, a biblioteca inteira — e todos os lançamentos do mês — ficam liberados para você."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {previa.map((l, i) => (
            <Reveal key={l.id} delay={(i % 5) * 70}>
              <BookCard livro={l} href={`/plataforma/livro/${l.id}`} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="#planos" className="btn-ghost">
            Quero acesso à biblioteca completa <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ================= COMO FUNCIONA ================= */}
      <section id="como-funciona" className="relative py-20">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-64 -translate-y-1/2 bg-radial-blood opacity-60" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Simples assim"
              titulo="Do desejo à leitura em"
              destaque="três passos"
            />
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {PASSOS.map((p, i) => (
              <Reveal key={p.titulo} delay={i * 100}>
                <div className="glass group relative h-full rounded-2xl p-8 transition-transform duration-500 hover:-translate-y-1">
                  <div className="absolute right-6 top-6 font-display text-6xl font-black text-white/5">
                    0{i + 1}
                  </div>
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-blood-800/40 text-champagne ring-1 ring-champagne/20">
                    <p.icon size={22} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">
                    {p.titulo}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    {p.texto}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PLANOS ================= */}
      <section id="planos" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Uma assinatura, tudo liberado"
            titulo="Menos que um café por semana,"
            destaque="a biblioteca inteira"
            sub="Uma única assinatura dá acesso a todo o acervo e a todos os lançamentos do mês. Sem fidelidade, cancele quando quiser."
          />
        </Reveal>
        <div className="mt-14">
          <Reveal>
            {plano && <Planos plano={plano} />}
          </Reveal>
        </div>
        <p className="mt-6 text-center text-xs text-white/35">
          Pagamento 100% seguro · Cancele quando quiser · Sem fidelidade
        </p>
      </section>

      {/* ================= DEPOIMENTOS ================= */}
      <section id="depoimentos" className="relative py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Elas não conseguem parar"
              titulo="O que dizem as"
              destaque="viciadas"
            />
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {DEPOIMENTOS.map((d, i) => (
              <Reveal key={d.nome} delay={i * 100}>
                <figure className="glass relative h-full rounded-2xl p-7 shadow-card">
                  <div className="absolute -top-3 left-6 grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blood-700 to-blood-900 text-white shadow-glow">
                    <Quote size={16} />
                  </div>
                  <blockquote className="mt-4 text-[15px] leading-relaxed text-white/75">
                    “{d.texto}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-blood-800/40 font-display text-lg font-bold text-champagne ring-1 ring-champagne/20">
                      {d.nome.charAt(0)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-white">
                        {d.nome}
                      </span>
                      <span className="block text-xs text-white/45">{d.tag}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Antes de mergulhar"
            titulo="Perguntas"
            destaque="frequentes"
          />
        </Reveal>
        <div className="mt-12">
          <Reveal>
            <FAQ />
          </Reveal>
        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-champagne/15 px-6 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_120%_at_50%_0%,rgba(161,29,46,0.45),rgba(10,6,7,0.2))]" />
            <div className="pointer-events-none absolute -bottom-20 left-1/2 h-56 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-blood-700/30 blur-[90px]" />
            <span className="eyebrow justify-center">
              <span className="h-px w-6 bg-champagne/50" /> Sua estante secreta espera
            </span>
            <h2 className="mx-auto mt-5 max-w-2xl font-display text-4xl font-black leading-tight text-white sm:text-5xl">
              Entregue-se ao seu próximo{" "}
              <span className="italic text-bloodied">vício</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Assine hoje e comece a ler em menos de um minuto. A primeira noite
              é sempre a mais perigosa.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="#planos" className="btn-primary">
                Assinar agora <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
