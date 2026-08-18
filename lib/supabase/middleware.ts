import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

/**
 * Protege as rotas privadas (/plataforma e /admin).
 * Em páginas públicas NÃO chamamos o Supabase — isso evita uma ida ao servidor
 * de autenticação a cada carregamento, deixando o site muito mais rápido.
 */
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const protegida = path.startsWith("/plataforma") || path.startsWith("/admin");

  // Página pública: segue direto, sem tocar no Supabase.
  if (!protegida) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const login = request.nextUrl.clone();
    login.pathname = "/entrar";
    login.searchParams.set("redirect", path);
    return NextResponse.redirect(login);
  }

  return response;
}
