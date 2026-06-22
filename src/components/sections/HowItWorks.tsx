"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Motion";
import { STEPS } from "@/lib/content";

export default function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto max-w-6xl px-6 py-32">
      <Reveal className="text-center">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-peach/70">
          Как это работает
        </span>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-section text-ink">
          Три шага до связи в любой точке мира
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.12}>
            <motion.div
              whileHover={{ y: -8, rotateX: 4, rotateY: -4 }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              className="group relative h-full overflow-hidden rounded-3xl glass p-8"
            >
              <div className="pointer-events-none absolute right-3 top-1 font-display text-[6rem] leading-none text-white/[0.04] transition-colors group-hover:text-peach/10">
                {s.n}
              </div>
              <div className="relative z-10">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-peach/10 font-mono text-peach">
                  {s.n}
                </span>
                <h3 className="mt-6 font-display text-2xl leading-tight text-ink">{s.title}</h3>
                <p className="mt-3 font-mono text-sm leading-relaxed text-mist/70">{s.text}</p>
              </div>
              <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-peach/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
