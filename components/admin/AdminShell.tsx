"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  UserX,
  BookCopy,
  Lightbulb,
  Plus,
  Menu,
  X,
  ExternalLink,
  Bell,
} from "lucide-react";
import Logo from "@/components/Logo";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/vendas", label: "Volume de vendas", icon: TrendingUp },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/renovacoes", label: "Não renovaram", icon: UserX },
  { href: "/admin/catalogo", label: "Catálogo & PDFs", icon: BookCopy },
  { href: "/admin/sugestoes", label: "Sugestões", icon: Lightbulb },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const NavList = () => (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
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

  const Marca = () => (
    <div className="flex items-center gap-2.5 px-1.5">
      <Logo href="/admin" />
      <span className="rounded-md border border-champagne/30 bg-blood-900/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-champagne">
        Admin
      </span>
    </div>
  );

  return (
    <div className="relative min-h-screen lg:flex">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/5 bg-ink-800/50 px-4 py-6 backdrop-blur-xl lg:flex">
        <Marca />
        <div className="my-6 rule" />
        <NavList />

        <div className="mt-auto">
          <Link href="/admin/catalogo/novo" className="btn-primary w-full justify-center !py-2.5 !text-[13px]">
            <Plus size={15} /> Novo livro
          </Link>
          <div className="rule my-4" />
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-white/45 transition-colors hover:text-white"
          >
            <ExternalLink size={16} /> Ver site público
          </Link>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-white/5 bg-ink/70 px-5 py-3.5 backdrop-blur-xl sm:px-8">
          <button
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/10 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu size={18} />
          </button>

          <div className="hidden sm:block">
            <p className="text-xs uppercase tracking-widest text-white/40">Painel administrativo</p>
            <p className="font-display text-lg font-bold text-white">Vício em Dark Romance</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/admin/catalogo/novo" className="btn-ghost !py-2 !px-4 !text-[13px]">
              <Plus size={15} /> Novo livro
            </Link>
            <button className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/10 text-white/60 hover:text-white" aria-label="Notificações">
              <Bell size={17} />
            </button>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-blood-800/40 font-display font-bold text-champagne ring-1 ring-champagne/20">
              A
            </span>
          </div>
        </div>

        <div className="px-5 py-8 sm:px-8">{children}</div>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-white/10 bg-ink-800 px-4 py-6">
            <div className="flex items-center justify-between">
              <Marca />
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
            <Link
              href="/"
              className="mt-auto flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-white/45 hover:text-white"
            >
              <ExternalLink size={16} /> Ver site público
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
