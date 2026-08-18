import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Rota de diagnóstico TEMPORÁRIA (não expõe segredos — só presença/tamanho).
// Remover depois de diagnosticar o deploy.
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let urlHost: string | null = null;
  if (url) {
    try {
      urlHost = new URL(url).host;
    } catch {
      urlHost = "URL_INVALIDA";
    }
  }

  const diag: Record<string, unknown> = {
    env: {
      urlPresent: !!url,
      urlHost,
      anonPresent: !!anon,
      anonLen: anon?.length ?? 0,
      servicePresent: !!service,
      serviceLen: service?.length ?? 0,
    },
  };

  try {
    const supabase = await createClient();
    const { data, error, count } = await supabase
      .from("books")
      .select("slug", { count: "exact" })
      .limit(3);
    diag.query = {
      ok: !error,
      count: count ?? data?.length ?? 0,
      sample: (data ?? []).map((b: { slug: string }) => b.slug),
      error: error ? { message: error.message, code: (error as { code?: string }).code } : null,
    };
  } catch (e) {
    diag.query = { ok: false, threw: String(e instanceof Error ? e.message : e) };
  }

  return NextResponse.json(diag);
}
