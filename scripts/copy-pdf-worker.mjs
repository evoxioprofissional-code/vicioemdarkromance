// Copia o worker do pdf.js de node_modules para /public, mantendo a versão
// em sincronia com pdfjs-dist. Rodado no postinstall e antes de dev/build.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const origem = join(
  raiz,
  "node_modules",
  "pdfjs-dist",
  "build",
  "pdf.worker.min.mjs"
);
const destinoDir = join(raiz, "public");
const destino = join(destinoDir, "pdf.worker.min.mjs");

if (!existsSync(origem)) {
  console.warn("[copy-pdf-worker] pdfjs-dist ainda não instalado; ignorando.");
  process.exit(0);
}

mkdirSync(destinoDir, { recursive: true });
copyFileSync(origem, destino);
console.log("[copy-pdf-worker] worker copiado para public/pdf.worker.min.mjs");
