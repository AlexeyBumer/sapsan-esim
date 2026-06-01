"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Motion";
import { FEATURES } from "@/lib/content";

const icons: Record<string, React.ReactNode> = {
  globe: <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" />,
  wallet: <path d="M3 7h18v12H3zM3 7l2-3h14l2 3M16 13h2" />,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  signal: <path d="M4 20v-4M9 20v-8M14 20V8M19 20V4" />,
  tower: <path d="M12 4v16M8 8a5 5 0 018 0M5 6a9 9 0 0114 0" />,
  plane: <path d="M21 14l-9 3-9-3 4-2 5 1 5-1zM12 17v4" />,
};

export default function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-6 py-32">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-peach/70">
          Возможности
        </span>
        <h2 className="mt-3 max-w-2xl font-display text-section text-ink">
          Связь, спроектированная <span className="text-grad">для тех, кто летает</span>
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.06}>
            <motion.article
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative h-full overflow-hidden rounded-2xl glass p-7"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-peach/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-9 w-9 text-peach"
              >
                {icons[f.icon]}
              </svg>
              <h3 className="mt-6 font-display text-xl text-ink">{f.title}</h3>
              <p className="mt-2 font-mono text-sm leading-relaxed text-mist/70">{f.text}</p>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-peach/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
