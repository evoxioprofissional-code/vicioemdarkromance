"use client";

import { useMemo, useState } from "react";
import { Search, Mail, MessageCircle } from "lucide-react";
import type { Cliente, StatusAssinatura } from "@/lib/types";
import { StatusBadge } from "./UI";

// Normaliza telefone para o formato do wa.me (dígitos + DDI 55).
function zap(tel: string): string {
  let d = tel.replace(/\D/g, "");
  if (d.length <= 11) d = "55" + d;
  return d;
}

type Filtro = "todos" | StatusAssinatura;

const FILTROS: { id: Filtro; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "active", label: "Ativos" },
  { id: "past_due", label: "Inadimplentes" },
  { id: "canceled", label: "Cancelados" },
];

export default function ClientesTable({
  clientes,
  filtros = true,
  colunaData = "Próxima cobrança",
  mostrarMotivo = false,
}: {
  clientes: Cliente[];
  filtros?: boolean;
  colunaData?: string;
  mostrarMotivo?: boolean;
}) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busca, setBusca] = useState("");

  const lista = useMemo(() => {
    return clientes.filter((c) => {
      const okFiltro = filtro === "todos" || c.status === filtro;
      const okBusca =
        c.nome.toLowerCase().includes(busca.toLowerCase()) ||
        c.email.toLowerCase().includes(busca.toLowerCase());
      return okFiltro && okBusca;
    });
  }, [clientes, filtro, busca]);

  return (
    <div className="glass rounded-2xl">
      {/* barra de filtros */}
      <div className="flex flex-col gap-3 border-b border-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        {filtros ? (
          <div className="flex flex-wrap gap-1.5">
            {FILTROS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFiltro(f.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  filtro === f.id
                    ? "bg-blood-800/50 text-white ring-1 ring-champagne/25"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-sm text-white/50">
            {lista.length} cliente(s)
          </span>
        )}

        <div className="relative">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar cliente…"
            className="w-full rounded-full border border-white/10 bg-ink-800/60 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-champagne/40 sm:w-64"
          />
        </div>
      </div>

      {/* tabela */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-white/40">
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Assinou em</th>
              <th className="px-5 py-3 font-medium">Tempo</th>
              <th className="px-5 py-3 font-medium">
                {mostrarMotivo ? "Motivo" : colunaData}
              </th>
              <th className="px-5 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {lista.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blood-800/40 font-display text-sm font-bold text-champagne ring-1 ring-champagne/20">
                      {c.nome.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{c.nome}</p>
                      <p className="truncate text-xs text-white/40">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-5 py-3.5 text-white/60">{c.entrouEm}</td>
                <td className="px-5 py-3.5 text-white/60">{c.meses} {c.meses === 1 ? "mês" : "meses"}</td>
                <td className="px-5 py-3.5 text-white/60">
                  {mostrarMotivo ? (
                    <span className="text-white/70">{c.motivo ?? "—"}</span>
                  ) : (
                    c.proximaCobranca
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="inline-flex gap-1">
                    {c.email && (
                      <a
                        href={`mailto:${c.email}`}
                        className="grid h-8 w-8 place-items-center rounded-lg text-white/45 hover:bg-white/5 hover:text-champagne"
                        aria-label={`Enviar e-mail para ${c.nome}`}
                        title="Enviar e-mail"
                      >
                        <Mail size={15} />
                      </a>
                    )}
                    {c.telefone ? (
                      <a
                        href={`https://wa.me/${zap(c.telefone)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid h-8 w-8 place-items-center rounded-lg text-white/45 hover:bg-white/5 hover:text-emerald-400"
                        aria-label={`WhatsApp de ${c.nome}`}
                        title="Abrir no WhatsApp"
                      >
                        <MessageCircle size={15} />
                      </a>
                    ) : (
                      <span className="grid h-8 w-8 place-items-center text-white/15" title="Sem WhatsApp">
                        <MessageCircle size={15} />
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {lista.length === 0 && (
          <p className="py-10 text-center text-sm text-white/40">
            Nenhum cliente encontrado.
          </p>
        )}
      </div>
    </div>
  );
}
