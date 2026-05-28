import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Convertido — Pesquisa de Satisfação",
  description:
    "Sua avaliação nos ajuda a entregar resultados cada vez melhores. Leva menos de 3 minutos.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Convertido — Pesquisa de Satisfação",
    description:
      "Sua avaliação nos ajuda a entregar resultados cada vez melhores. Leva menos de 3 minutos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-brand-dark text-brand-light antialiased">
        {children}
      </body>
    </html>
  );
}
