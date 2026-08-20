import Link from "next/link";
import { CheckCircle2, BookOpen } from "lucide-react";
import Logo from "@/components/Logo";

export const metadata = { title: "Pagamento recebido — Vício em Dark Romance" };

export default function SucessoPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-radial-blood opacity-70" />

      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="glass-strong rounded-2xl p-8">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-white">
            Pagamento recebido!
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Estamos liberando o seu acesso — pode levar alguns segundos após a
            confirmação. Se a biblioteca ainda não abrir, atualize a página em
            instantes. 🖤
          </p>
          <Link href="/plataforma" className="btn-primary mt-6 w-full justify-center !py-3.5">
            <BookOpen size={16} /> Ir para a biblioteca
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-white/35">
          <Link href="/plataforma/conta" className="hover:text-white/60">
            Ver status da minha assinatura
          </Link>
        </p>
      </div>
    </main>
  );
}
