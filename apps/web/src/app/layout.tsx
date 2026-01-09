import type { Metadata } from "next";
import "./globals.css";
import { TemaProvider, IdiomaProvider } from "@/hooks";

export const metadata: Metadata = {
  title: "Lavra.ia | Inteligência Preditiva para o Agro",
  description: "Tome decisões de milhões com confiança. IA que conecta clima, mercado e sua fazenda em uma única plataforma preditiva.",
  keywords: ["agronegócio", "agro", "fazenda", "clima", "mercado", "IA", "inteligência artificial", "previsão", "soja", "milho"],
  authors: [{ name: "Lavra.ia" }],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Lavra.ia | Inteligência Preditiva para o Agro",
    description: "Tome decisões de milhões com confiança. IA que conecta clima, mercado e sua fazenda.",
    type: "website",
    locale: "pt_BR",
    siteName: "Lavra.ia",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lavra.ia - Inteligência Preditiva",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lavra.ia | Inteligência Preditiva para o Agro",
    description: "Tome decisões de milhões com confiança. IA que conecta clima, mercado e sua fazenda.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans antialiased bg-white dark:bg-[#0A0A0A] text-neutral-900 dark:text-white transition-colors">
        <TemaProvider>
          <IdiomaProvider>
            {children}
          </IdiomaProvider>
        </TemaProvider>
      </body>
    </html>
  );
}
