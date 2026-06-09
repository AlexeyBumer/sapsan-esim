import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/FaqContactFooter";
import { ARTICLES } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Блог об eSIM",
  description:
    "Статьи об eSIM Sapsan: доступ без VPN, обход блокировок, интернет в разных странах без роуминга.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const categories = ["Без блокировок", "Страны", "Гайды"] as const;

  return (
    <main className="relative">
      <Navbar />
      <section className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-peach/70">Блог</span>
        <h1 className="mt-3 font-display text-section text-ink">Всё об eSIM и доступе без границ</h1>
        <p className="mt-4 max-w-xl font-mono text-sm text-mist/60">
          Как пользоваться интернетом без VPN, обходить блокировки и оставаться на связи в любой
          стране.
        </p>

        {categories.map((cat) => (
          <div key={cat} className="mt-12">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-peach/70">{cat}</h2>
            <div className="grid gap-2">
              {ARTICLES.filter((a) => a.category === cat).map((a) => (
                <a
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl glass px-5 py-4 transition-colors hover:border-peach/30"
                >
                  <div>
                    <p className="font-display text-lg text-ink">{a.title}</p>
                    <p className="mt-1 font-mono text-xs text-mist/60">{a.description}</p>
                  </div>
                  <span className="flex-none text-peach transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
      <Footer />
    </main>
  );
}
