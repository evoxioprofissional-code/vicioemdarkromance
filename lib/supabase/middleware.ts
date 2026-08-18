import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

/**
 * Renova a sessão do Supabase a cada requisição e protege rotas privadas.
 * Se as variáveis de ambiente ainda não estiverem configuradas, é um no-op
 * (o protótipo continua funcionando no modo mock).
 */
export async function updateSession(request: NextRequest) {
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

  const path = request.nextUrl.pathname;

  // Área do assinante e admin exigem login.
  const protegida = path.startsWith("/plataforma") || path.startsWith("/admin");
  if (protegida && !user) {
    const login = request.nextUrl.clone();
    login.pathname = "/entrar";
    login.searchParams.set("redirect", path);
    return NextResponse.redirect(login);
  }

  return response;
}
