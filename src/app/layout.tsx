import type { Metadata, Viewport } from "next";
import { Prociono, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";
import SmoothScroll from "@/lib/SmoothScroll";

/**
 * Prociono — крупные дисплейные заголовки. Грузится из Google Fonts.
 * JetBrains Mono — интерфейс, цифры, тарифы.
 * Шрифты подключаются автоматически — никаких файлов скачивать не нужно.
 */
const prociono = Prociono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-prociono",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  // Домен сайта
  metadataBase: new URL("https://sapsansim.com"),
  title: {
    default: "Sapsan eSIM — Приземляйся на связи",
    template: "%s · Sapsan eSIM",
  },
  description:
    "Глобальная eSIM с оплатой по мере использования. Работает при любых блокировках без VPN. Без роуминга и скрытых наценок. 150+ стран, активация за минуту.",
  keywords: [
    "eSIM",
    "есим",
    "купить eSIM",
    "eSIM без VPN",
    "интернет за границей",
    "eSIM для путешествий",
    "глобальная eSIM",
    "Sapsan",
    "eSIM Россия",
    "мобильный интернет без роуминга",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sapsan eSIM — Приземляйся на связи",
    description:
      "Глобальная eSIM с оплатой по мере использования. Работает при любых блокировках без VPN. 150+ стран.",
    type: "website",
    locale: "ru_RU",
    siteName: "Sapsan eSIM",
    url: "/",
    images: [
      {
        url: "/og-image.png", // создайте картинку 1200×630 и положите в /public
        width: 1200,
        height: 630,
        alt: "Sapsan eSIM — Приземляйся на связи",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sapsan eSIM — Приземляйся на связи",
    description:
      "Глобальная eSIM с оплатой по мере использования. Работает при любых блокировках без VPN.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  verification: {
    google: "googlee6177da57a2d7257",
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
