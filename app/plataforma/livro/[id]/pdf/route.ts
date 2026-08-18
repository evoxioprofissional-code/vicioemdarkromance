import { NextRequest, NextResponse } from "next/server";
import { getAcesso } from "@/lib/queries/account";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Entrega o PDF do livro via link assinado — SOMENTE para assinante ativo ou admin.
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const acesso = await getAcesso();
  if (!acesso) {
    return NextResponse.redirect(new URL("/entrar?redirect=/plataforma", req.url));
  }
  if (!acesso.isAdmin && !acesso.ativo) {
    return NextResponse.redirect(new URL("/plataforma/conta?assine=1", req.url));
  }

  const supabase = await createClient();
  const { data: book } = await supabase
    .from("books")
    .select("pdf_path, titulo")
    .eq("slug", params.id)
    .maybeSingle();

  const back = new URL(`/plataforma/livro/${params.id}`, req.url);
  if (!book?.pdf_path) return NextResponse.redirect(back);

  const dl = req.nextUrl.searchParams.get("dl") === "1";
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from("pdfs")
    .createSignedUrl(book.pdf_path, 120, dl ? { download: `${book.titulo}.pdf` } : {});

  if (error || !data) return NextResponse.redirect(back);
  return NextResponse.redirect(data.signedUrl);
}
