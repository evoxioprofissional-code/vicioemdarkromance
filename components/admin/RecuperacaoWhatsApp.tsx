"use client";

import { useState } from "react";
import { MessageCircle, Copy, Check, RotateCcw, PhoneOff } from "lucide-react";
import type { Cliente } from "@/lib/types";

const MODELO_PADRAO =
  "Oi {nome}! 🖤 Aqui é do Vício em Dark Romance. Sua assinatura está pausada e a gente sentiu sua falta na biblioteca! Que tal voltar a devorar seus dark romances por só R$ 9,99/mês? É rapidinho reativar — qualquer dúvida, me chama por aqui. 😊";

// Normaliza para o formato do wa.me (só dígitos, com DDI 55 do Brasil).
function paraWhatsApp(tel: string): string {
  let d = tel.replace(/\D/g, "");
  if (d.length <= 11) d = "55" + d; // sem DDI → assume Brasil
  return d;
}

function primeiroNome(nome: string): string {
  return (nome || "").trim().split(" ")[0] || "leitora";
}

export default function RecuperacaoWhatsApp({ clientes }: { clientes: Cliente[] }) {
  const [modelo, setModelo] = useState(MODELO_PADRAO);
  const [copiado, setCopiado] = useState<string | null>(null);

  const montarMsg = (c: Cliente) => modelo.replaceAll("{nome}", primeiroNome(c.nome));

  const copiar = async (c: Cliente) => {
    try {
      await navigator.clipboard.writeText(montarMsg(c));
      setCopiado(c.id);
      setTimeout(() => setCopiado(null), 1800);
    } catch {
      /* clipboard indisponível */
    }
  };

  return (
    <div className="space-y-6">
      {/* Editor do modelo */}
      <div className="glass rounded-2xl p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <MessageCircle size={18} className="text-champagne" /> Modelo da mensagem
          </h2>
          <button
            onClick={() => setModelo(MODELO_PADRAO)}
            className="inline-flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-white"
          >
            <RotateCcw size={13} /> Restaurar
          </button>
        </div>
        <textarea
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-xl border border-white/10 bg-ink-800/60 px-3 py-2.5 text-sm leading-relaxed text-white outline-none focus:border-champagne/40"
        />
        <p className="mt-2 text-xs text-white/40">
          Use <code className="rounded bg-white/10 px-1 text-champagne">{"{nome}"}</code> para
          inserir o nome do cliente automaticamente.
        </p>
      </div>

      {/* Lista de clientes para recuperar */}
      {clientes.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-sm text-white/45">
          🎉 Nenhum cliente para recuperar no momento.
        </div>
      ) : (
        <ul className="space-y-3">
          {clientes.map((c) => {
            const temTel = !!c.telefone && c.telefone.replace(/\D/g, "").length >= 8;
            const link = temTel
              ? `https://wa.me/${paraWhatsApp(c.telefone!)}?text=${encodeURIComponent(montarMsg(c))}`
              : null;
            return (
              <li key={c.id} className="glass flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold text-white">{c.nome}</p>
                  <p className="text-xs text-white/45">
                    {c.email}
                    {c.telefone ? ` · ${c.telefone}` : ""}
                    {c.motivo ? ` · motivo: ${c.motivo}` : ""}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => copiar(c)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-2 text-xs font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white"
                  >
                    {copiado === c.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {copiado === c.id ? "Copiado" : "Copiar mensagem"}
                  </button>

                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-3.5 py-2 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5"
                    >
                      <MessageCircle size={14} /> Abrir no WhatsApp
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-2 text-xs text-white/35">
                      <PhoneOff size={14} /> Sem WhatsApp
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
