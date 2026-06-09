import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import CountrySearch from "@/components/sections/CountrySearch";
import EsimCheck from "@/components/sections/EsimCheck";
import HowItWorks from "@/components/sections/HowItWorks";
import WorldMap from "@/components/sections/WorldMap";
import Referral from "@/components/sections/Referral";
import { Personas, Stats } from "@/components/sections/PersonasStats";
import { Faq, Contact, Footer } from "@/components/sections/FaqContactFooter";

export default function Home() {
  // Структурированные данные для поисковиков (Google понимает, что это за продукт)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Sapsan eSIM",
    description:
      "Глобальная eSIM с оплатой по мере использования. Работает при любых блокировках без VPN. 150+ стран.",
    brand: { "@type": "Brand", name: "Sapsan" },
    offers: {
      "@type": "Offer",
      price: "9.95",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <Hero />
      <Features />
      <CountrySearch />
      <EsimCheck />
      <HowItWorks />
      <WorldMap />
      <Referral />
      <Personas />
      <Stats />
      <Faq />
      <Contact />
      <Footer />
    </main>
  );
}
