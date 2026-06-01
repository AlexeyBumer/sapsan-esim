"use client";

import { motion } from "framer-motion";
import { Reveal, AnimatedCounter } from "@/components/ui/Motion";
import { PERSONAS, STATS, ACTIVATION_NOTE } from "@/lib/content";

export function Personas() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-32">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-peach/70">
          Для кого
        </span>
        <h2 className="mt-3 max-w-2xl font-display text-section text-ink">
          Создано в небе — работает на земле
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PERSONAS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.07}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              className={`group relative h-full overflow-hidden rounded-2xl p-7 ${
                i === 0 ? "glass-strong" : "glass"
              } ${i === 0 ? "lg:row-span-2 lg:flex lg:flex-col lg:justify-between" : ""}`}
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-peach/70">
                {p.tag}
              </span>
              <h3 className="mt-4 font-display text-2xl text-ink">{p.title}</h3>
              <p className="mt-2 font-mono text-sm leading-relaxed text-mist/70">{p.text}</p>
              <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-peach/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Stats() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <div className="grid gap-px overflow-hidden rounded-3xl glass sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-abyss/20 p-8 text-center">
              <p className="font-mono text-4xl font-semibold text-grad sm:text-5xl">
                <AnimatedCounter
                  to={s.value}
                  prefix={"prefix" in s ? (s.prefix as string) : ""}
                  suffix={s.suffix}
                  decimals={s.value % 1 !== 0 ? 1 : 0}
                />
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-mist/60">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.15}>
        <p className="mx-auto mt-6 max-w-2xl text-center font-mono text-xs leading-relaxed text-mist/50">
          {ACTIVATION_NOTE}
        </p>
      </Reveal>
    </section>
  );
}
