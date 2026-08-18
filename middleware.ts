import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Roda em toda navegação para manter a sessão do Supabase válida.
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Ignora assets estáticos e imagens.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
