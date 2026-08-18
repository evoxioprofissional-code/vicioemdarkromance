import Link from "next/link";
import { Lock, Mail, User, AlertCircle } from "lucide-react";
import Logo from "@/components/Logo";
import { cadastrar } from "@/lib/auth/actions";

export default function CadastrarPage({
  searchParams,
}: {
  searchParams: { erro?: string };
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-radial-blood opacity-70" />

      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="glass-strong rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold text-white">Criar conta</h1>
          <p className="mt-1 text-sm text-white/50">
            Comece seu vício em dark romance hoje.
          </p>

          {searchParams.erro && (
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-blood-600/40 bg-blood-900/30 px-3 py-2.5 text-sm text-smoke">
              <AlertCircle size={15} /> {searchParams.erro}
            </div>
          )}

          <form action={cadastrar} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
                Nome
              </label>
              <div className="relative">
                <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  name="nome"
                  type="text"
                  required
                  placeholder="Seu nome"
                  className="w-full rounded-xl border border-white/10 bg-ink-800/60 py-3 pl-9 pr-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-champagne/40"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
                E-mail
              </label>
              <div className="relative">
                <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="voce@email.com"
                  className="w-full rounded-xl border border-white/10 bg-ink-800/60 py-3 pl-9 pr-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-champagne/40"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
                Senha
              </label>
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-xl border border-white/10 bg-ink-800/60 py-3 pl-9 pr-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-champagne/40"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center !py-3.5">
              Criar conta
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/50">
            Já tem conta?{" "}
            <Link href="/entrar" className="text-champagne hover:underline">
              Entrar
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-white/35">
          <Link href="/" className="hover:text-white/60">← Voltar ao site</Link>
        </p>
      </div>
    </main>
  );
}
