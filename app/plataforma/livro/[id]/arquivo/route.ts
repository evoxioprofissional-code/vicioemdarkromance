import { NextRequest, NextResponse } from "next/server";
import { getAcesso } from "@/lib/queries/account";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Transmite os BYTES do PDF por dentro do site (proxy), somente para
// assinante ativo ou admin. Ao contrário de um link assinado, a URL do
// arquivo no storage NUNCA chega ao navegador — o leitor (react-pdf)
// consome este endpoint e desenha as páginas em <canvas>, sem barra do
// navegador, sem botão de baixar. É o que alimenta o leitor no site.
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const acesso = await getAcesso();
  if (!acesso) {
    return new NextResponse("Não autenticado", { status: 401 });
  }
  if (!acesso.isAdmin && !acesso.ativo) {
    return new NextResponse("Assinatura inativa", { status: 403 });
  }

  const supabase = await createClient();
  const { data: book } = await supabase
    .from("books")
    .select("pdf_path")
    .eq("slug", params.id)
    .maybeSingle();

  if (!book?.pdf_path) {
    return new NextResponse("PDF não encontrado", { status: 404 });
  }

  // Baixa o arquivo no servidor (respeita a RLS do bucket privado "pdfs").
  const { data: blob, error } = await supabase.storage
    .from("pdfs")
    .download(book.pdf_path);

  if (error || !blob) {
    return new NextResponse("Falha ao carregar o PDF", { status: 502 });
  }

  const buffer = Buffer.from(await blob.arrayBuffer());

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      // inline = abrir no leitor, não baixar como anexo.
      "Content-Disposition": "inline",
      "Content-Length": String(buffer.length),
      // Não guardar em cache do navegador/CDN.
      "Cache-Control": "private, no-store, max-age=0, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
