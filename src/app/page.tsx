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
  return (
    <main className="relative">
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
