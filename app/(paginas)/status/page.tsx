import { CheckCircle2 } from "lucide-react";
import { DocHeader } from "@/components/PageChrome";

export const metadata = { title: "Status do sistema — Vício em Dark Romance" };

const SERVICOS = [
  { nome: "Site e catálogo", desc: "Navegação e páginas do clube" },
  { nome: "Login e contas", desc: "Cadastro e acesso dos assinantes" },
  { nome: "Leitura e download de PDFs", desc: "Abrir e baixar os livros" },
  { nome: "Pagamentos e assinaturas", desc: "Cobrança e liberação de acesso" },
];

export default function StatusPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Ajuda"
        titulo="Status do sistema"
        intro="Acompanhe a saúde dos serviços do clube em tempo real."
      />

      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
        <CheckCircle2 size={22} className="text-emerald-400" />
        <div>
          <p className="font-display text-lg font-bold text-white">Tudo funcionando normalmente</p>
          <p className="text-sm text-white/55">Nenhum incidente em andamento.</p>
        </div>
      </div>

      <ul className="space-y-3">
        {SERVICOS.map((s) => (
          <li key={s.nome} className="glass flex items-center justify-between gap-4 rounded-2xl p-5">
            <div>
              <p className="font-display text-base font-semibold text-white">{s.nome}</p>
              <p className="text-sm text-white/45">{s.desc}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Operacional
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-white/45">
        Percebeu alguma instabilidade? Avise a gente em{" "}
        <a href="/contato" className="text-champagne underline underline-offset-2">Fale conosco</a>{" "}
        que verificamos na hora.
      </p>
    </article>
  );
}
