"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// O leitor usa pdf.js (APIs de navegador). Carregamos só no cliente (ssr:false).
const LeitorPdf = dynamic(() => import("./LeitorPdf"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center gap-2 py-32 text-white/50">
      <Loader2 className="animate-spin" size={18} /> Abrindo leitor…
    </div>
  ),
});

export default function LeitorClient(props: {
  slug: string;
  titulo: string;
  fileUrl: string;
  startPage: number;
}) {
  return <LeitorPdf {...props} />;
}
