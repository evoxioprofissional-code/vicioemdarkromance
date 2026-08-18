import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// Serifa elegante para títulos/display
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// Sans limpa para o corpo
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vício em Dark Romance — Clube de Assinatura",
  description:
    "O clube por assinatura para quem gosta do proibido. Uma biblioteca de dark romance em PDF, com novos títulos todo mês.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      {/* .grain adiciona a textura de ruído sobre toda a página */}
      <body className="grain">{children}</body>
    </html>
  );
}
