"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  UserRound,
  Lightbulb,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Logo from "./Logo";
import BuscaLivros from "./BuscaLivros";
import { sair } from "@/lib/auth/actions";

const NAV = [
  { href: "/plataforma", label: "Início", icon: Home },
  { href: "/plataforma/sugestoes", label: "Sugerir livros", icon: Lightbulb },
  { href: "/plataforma/conta", label: "Minha Conta", icon: UserRound },
];

/** Casca da área do assinante: sidebar (desktop) + topbar (mobile). */
export default function PlatformShell({
  children,
  inicial = "•",
}: {
  children: React.ReactNode;
  inicial?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/plataforma"
      ? pathname === "/plataforma"
      : pathname.startsWith(href.split("?")[0]) && href !== "/plataforma";

  const NavList = () => (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-all ${
              active
                ? "bg-blood-800/30 text-white ring-1 ring-champagne/20"
                : "text-white/55 hover:bg-white/5 hover:text-white"
            }`}
          >
            <item.icon
              size={18}
              className={active ? "text-champagne" : "text-white/45 group-hover:text-white/70"}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="relative min-h-screen lg:flex">
      {/* ---------- Sidebar desktop ---------- */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/5 bg-ink-800/50 px-4 py-6 backdrop-blur-xl lg:flex">
        <Logo href="/plataforma" className="px-1.5" />
        <div className="my-6 rule" />
        <NavList />

        <div className="mt-auto">
          <div className="rule mb-4" />
          <div className="glass rounded-xl p-4">
            <p className="text-xs font-semibold text-champagne">Sua assinatura</p>
            <p className="mt-1 text-[11px] text-white/45">
              Veja o status e gerencie seu plano.
            </p>
            <Link
              href="/plataforma/conta"
              className="mt-3 block text-center text-xs text-white/70 underline-offset-2 hover:text-white hover:underline"
            >
              Gerenciar assinatura
            </Link>
          </div>
          <form action={sair}>
            <button
              type="submit"
              className="mt-3 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-white/45 transition-colors hover:text-white"
            >
              <LogOut size={17} /> Sair
            </button>
          </form>
        </div>
      </aside>

      {/* ---------- Conteúdo ---------- */}
      <div className="min-w-0 flex-1">
        {/* topbar */}
        <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-white/5 bg-ink/70 px-5 py-3.5 backdrop-blur-xl sm:px-8">
          <button
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/10 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu size={18} />
          </button>

          <Logo href="/plataforma" className="lg:hidden" />

          <div className="flex min-w-0 flex-1 justify-center sm:justify-start">
            <BuscaLivros />
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/plataforma/conta"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blood-800/40 font-display font-bold text-champagne ring-1 ring-champagne/20"
            >
              {inicial}
            </Link>
          </div>
        </div>

        <div className="px-5 py-8 sm:px-8">{children}</div>
      </div>

      {/* ---------- Drawer mobile ---------- */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-white/10 bg-ink-800 px-4 py-6">
            <div className="flex items-center justify-between">
              <Logo href="/plataforma" />
              <button
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-white/10"
                aria-label="Fechar"
              >
                <X size={17} />
              </button>
            </div>
            <div className="my-6 rule" />
            <NavList />
            <form action={sair} className="mt-auto">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-white/45 hover:text-white"
              >
                <LogOut size={17} /> Sair
              </button>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}
