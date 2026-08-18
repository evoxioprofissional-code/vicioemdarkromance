import Link from "next/link";
import { Instagram, Music2, Mail, Clock, HelpCircle } from "lucide-react";
import { DocHeader } from "@/components/PageChrome";

export const metadata = { title: "Fale conosco — Vício em Dark Romance" };

// Ajuste estes contatos com os canais reais do clube.
const EMAIL = "contato@vicioemdarkromance.com";

export default function ContatoPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Ajuda"
        titulo="Fale conosco"
        intro="Deu problema, ficou com dúvida ou quer sugerir algo? A gente responde rápido — e sem robô."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <a href={`mailto:${EMAIL}`} className="glass group flex items-center gap-4 rounded-2xl p-5 transition-transform hover:-translate-y-1">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-blood-800/40 text-champagne ring-1 ring-champagne/20">
            <Mail size={20} />
          </span>
          <span>
            <span className="block font-display text-base font-semibold text-white">E-mail</span>
            <span className="block text-sm text-white/50">{EMAIL}</span>
          </span>
        </a>

        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="glass group flex items-center gap-4 rounded-2xl p-5 transition-transform hover:-translate-y-1">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-blood-800/40 text-champagne ring-1 ring-champagne/20">
            <Instagram size={20} />
          </span>
          <span>
            <span className="block font-display text-base font-semibold text-white">Instagram</span>
            <span className="block text-sm text-white/50">Chame no direct</span>
          </span>
        </a>

        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="glass group flex items-center gap-4 rounded-2xl p-5 transition-transform hover:-translate-y-1">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-blood-800/40 text-champagne ring-1 ring-champagne/20">
            <Music2 size={20} />
          </span>
          <span>
            <span className="block font-display text-base font-semibold text-white">TikTok</span>
            <span className="block text-sm text-white/50">@vicioemdark</span>
          </span>
        </a>

        <div className="glass flex items-center gap-4 rounded-2xl p-5">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-champagne">
            <Clock size={20} />
          </span>
          <span>
            <span className="block font-display text-base font-semibold text-white">Horário</span>
            <span className="block text-sm text-white/50">Respondemos de seg a sáb, 9h–20h</span>
          </span>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-champagne/15 bg-blood-900/15 p-5">
        <p className="flex items-center gap-2 font-display text-lg font-semibold text-white">
          <HelpCircle size={18} className="text-champagne" /> Antes de escrever
        </p>
        <p className="mt-2 text-sm text-white/60">
          Muitas dúvidas já estão respondidas na{" "}
          <Link href="/ajuda" className="text-champagne underline underline-offset-2">Central de ajuda</Link>{" "}
          e em{" "}
          <Link href="/como-ler" className="text-champagne underline underline-offset-2">Como ler os PDFs</Link>.
          Sobre cobrança, veja a{" "}
          <Link href="/reembolso" className="text-champagne underline underline-offset-2">Política de reembolso</Link>.
        </p>
      </div>
    </article>
  );
}
