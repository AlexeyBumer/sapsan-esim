import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/FaqContactFooter";
import ArticleCta from "@/components/sections/ArticleCta";
import { ARTICLES, getArticle } from "@/lib/articles";

// Генерируем все статьи статически (быстро и хорошо для SEO)
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Статья не найдена" };
  return {
    title: article.title,
    description: article.description,
    keywords: [...article.keywords],
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url: `/blog/${article.slug}`,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  // Структурированные данные статьи для Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: { "@type": "Organization", name: "Sapsan" },
    publisher: { "@type": "Organization", name: "Sapsan eSIM" },
  };

  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <article className="mx-auto max-w-2xl px-6 pb-24 pt-32">
        {/* хлебные крошки */}
        <nav className="mb-6 font-mono text-xs text-mist/50">
          <a href="/" className="hover:text-peach">Главная</a>
          <span className="mx-2">/</span>
          <a href="/blog" className="hover:text-peach">Блог</a>
        </nav>

        <span className="font-mono text-xs uppercase tracking-[0.25em] text-peach/70">
          {article.category}
        </span>
        <h1 className="mt-3 font-display text-section leading-tight text-ink">{article.title}</h1>
        <p className="mt-3 font-mono text-xs text-mist/40">
          Чтение ~{article.readMinutes} мин · Sapsan eSIM
        </p>

        {/* интро */}
        <p className="mt-8 font-mono text-base leading-relaxed text-mist">{article.intro}</p>

        {/* секции */}
        {article.sections.map((s, i) => (
          <section key={i} className="mt-10">
            <h2 className="font-display text-2xl leading-tight text-ink">{s.h}</h2>
            {s.p.map((para, j) => (
              <p key={j} className="mt-3 font-mono text-sm leading-relaxed text-mist/80">
                {para}
              </p>
            ))}
          </section>
        ))}

        <ArticleCta />

        {/* другие статьи */}
        <div className="mt-14">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-mist/50">
            Читайте также
          </p>
          <div className="grid gap-2">
            {ARTICLES.filter((a) => a.slug !== article.slug)
              .slice(0, 4)
              .map((a) => (
                <a
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="flex items-center justify-between rounded-xl glass px-4 py-3 font-mono text-sm text-mist/80 transition-colors hover:border-peach/30 hover:text-ink"
                >
                  <span>{a.title}</span>
                  <span className="text-peach">→</span>
                </a>
              ))}
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
