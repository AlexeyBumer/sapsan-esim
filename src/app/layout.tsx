import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";
import SmoothScroll from "@/lib/SmoothScroll";

/**
 * Prociono — для крупных дисплейных заголовков.
 * Положите Prociono-Regular.woff2 в /public/fonts.
 * (Шрифт доступен в Google Fonts / The League of Moveable Type.)
 */
const prociono = localFont({
  src: "../../public/fonts/Prociono-Regular.woff2",
  variable: "--font-prociono",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sapsan eSIM — Приземляйся на связи",
  description:
    "Глобальная eSIM с оплатой по мере использования. Без роуминга, без пакетов, без тарифов. Создано для лётного состава — теперь доступно каждому.",
  openGraph: {
    title: "Sapsan eSIM — Приземляйся на связи",
    description: "Глобальная eSIM с оплатой по мере использования.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#021111",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${prociono.variable} ${jetbrains.variable}`}>
      <body className="noise font-mono antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
