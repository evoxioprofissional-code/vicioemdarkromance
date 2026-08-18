import Link from "next/link";
import { Instagram, Music2 } from "lucide-react";
import Logo from "./Logo";

const COLS = [
  {
    titulo: "O Clube",
    links: [
      { label: "Catálogo", href: "/#catalogo" },
      { label: "Como funciona", href: "/#como-funciona" },
      { label: "Planos", href: "/#planos" },
      { label: "Lançamentos", href: "/lancamentos" },
    ],
  },
  {
    titulo: "Ajuda",
    links: [
      { label: "Central de ajuda", href: "/ajuda" },
      { label: "Como ler os PDFs", href: "/como-ler" },
      { label: "Fale conosco", href: "/contato" },
    ],
  },
  {
    titulo: "Legal",
    links: [
      { label: "Termos de uso", href: "/termos" },
      { label: "Privacidade", href: "/privacidade" },
      { label: "Conteúdo +18", href: "/conteudo-adulto" },
      { label: "Reembolso", href: "/reembolso" },
    ],
  },
];

// Só Instagram e TikTok.
const REDES = [
  { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/vicio_em_dark_romance" },
  { Icon: Music2, label: "TikTok", href: "https://www.tiktok.com/@vicio_em_dark_romance" },
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
              {REDES.map(({ Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-white/10 text-white/60 transition-all hover:text-champagne hover:ring-champagne/40"
                  aria-label={label}
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
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Vício em Dark Romance. Todos os direitos
            reservados.
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-blood-700/40 bg-blood-900/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-smoke">
            Conteúdo adulto · +18
          </span>
        </div>
      </div>
    </footer>
  );
}
