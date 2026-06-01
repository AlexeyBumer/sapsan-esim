"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Motion";
import MagneticButton from "@/components/ui/MagneticButton";
import { REFERRAL, CONTACTS } from "@/lib/content";

export default function Referral() {
  return (
    <section id="referral" className="relative mx-auto max-w-6xl px-6 py-24 scroll-mt-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] glass-strong p-10 sm:p-14">
          {/* свечение */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-peach/15 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-surface-3/40 blur-[80px]" />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-peach/70">
                Реферальная программа
              </span>
              <h2 className="mt-3 font-display text-section text-ink">{REFERRAL.title}</h2>
              <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-mist/70">
                {REFERRAL.text}
              </p>
              <div className="mt-8">
                <MagneticButton href={CONTACTS.telegram}>
                  Пригласить друга →
                </MagneticButton>
              </div>
            </div>

            {/* визуал награды */}
            <div className="flex justify-center lg:justify-end">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative grid h-52 w-52 place-items-center rounded-full border border-peach/20 bg-abyss/40"
              >
                <span className="absolute inset-4 rounded-full border border-peach/10" />
                <span className="absolute inset-10 rounded-full border border-peach/5" />
                <div className="text-center">
                  <p className="font-mono text-5xl font-bold text-grad leading-none">+{REFERRAL.reward}</p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-mist/60">
                    за друга
                  </p>
                </div>
                {/* орбитальная точка */}
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-peach shadow-glow-sm" />
                </motion.span>
              </motion.div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
