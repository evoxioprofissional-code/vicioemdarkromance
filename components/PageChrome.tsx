import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "./Logo";
import Footer from "./Footer";

/** Moldura das páginas institucionais: topo simples + conteúdo + rodapé. */
export default function PageChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-radial-blood opacity-60" />

      <header className="mx-auto flex max-w-4xl items-center justify-between px-5 py-6 sm:px-8">
        <Logo />
        <div className="flex items-center gap-4">
          <Link href="/" className="hidden items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white sm:inline-flex">
            <ArrowLeft size={15} /> Voltar ao site
          </Link>
          <Link href="/#planos" className="btn-primary !py-2.5 !text-[13px]">
            Assinar agora
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-20 pt-6 sm:px-8">{children}</main>

      <Footer />
    </div>
  );
}

/** Cabeçalho padrão de um documento (eyebrow + título + atualização). */
export function DocHeader({
  eyebrow,
  titulo,
  atualizado,
  intro,
}: {
  eyebrow: string;
  titulo: string;
  atualizado?: string;
  intro?: string;
}) {
  return (
    <div className="mb-8 border-b border-white/5 pb-8">
      <span className="eyebrow">{eyebrow}</span>
      <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
        {titulo}
      </h1>
      {intro && <p className="mt-4 text-lg leading-relaxed text-white/60">{intro}</p>}
      {atualizado && (
        <p className="mt-4 text-xs uppercase tracking-wider text-white/35">
          Atualizado em {atualizado}
        </p>
      )}
    </div>
  );
}
