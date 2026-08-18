import Link from "next/link";
import { Instagram, Music2, BookHeart, Mail } from "lucide-react";
import Logo from "./Logo";

const COLS = [
  {
    titulo: "O Clube",
    links: ["Catálogo", "Como funciona", "Planos", "Lançamentos"],
  },
  {
    titulo: "Ajuda",
    links: ["Central de ajuda", "Como ler os PDFs", "Fale conosco", "Status"],
  },
  {
    titulo: "Legal",
    links: ["Termos de uso", "Privacidade", "Conteúdo +18", "Reembolso"],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px rule" />
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              O clube por assinatura para quem gosta do proibido. Novos títulos
              de dark romance todo mês, prontos para ler onde você estiver.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Instagram, Music2, BookHeart, Mail].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-white/10 text-white/60 transition-all hover:text-champagne hover:ring-champagne/40"
                  aria-label="Rede social"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.titulo}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-champagne/80">
                {col.titulo}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link
                      href="#"
                      className="text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Vício em Dark Romance. Protótipo de
            demonstração — conteúdo fictício.
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-blood-700/40 bg-blood-900/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-smoke">
            Conteúdo adulto · +18
          </span>
        </div>
      </div>
    </footer>
  );
}
