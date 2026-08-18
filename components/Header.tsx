"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const LINKS = [
  { href: "#catalogo", label: "Catálogo" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#planos", label: "Planos" },
  { href: "#depoimentos", label: "Leitoras" },
  { href: "#faq", label: "FAQ" },
];

/** Header fixo transparente que ganha fundo ao rolar. */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/5 bg-ink/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-white/65 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/entrar" className="text-sm text-white/65 transition-colors hover:text-white">
            Entrar
          </Link>
          <Link href="#planos" className="btn-primary !py-2.5 !text-[13px]">
            Assinar agora
          </Link>
        </div>

        {/* botão mobile */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/10 lg:hidden"
          aria-label="Menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* menu mobile */}
      {open && (
        <div className="border-t border-white/5 bg-ink/95 px-5 py-4 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-white/75 hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Link href="/entrar" className="btn-ghost !py-2.5 justify-center">
                Entrar
              </Link>
              <Link href="#planos" onClick={() => setOpen(false)} className="btn-primary justify-center">
                Assinar agora
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
