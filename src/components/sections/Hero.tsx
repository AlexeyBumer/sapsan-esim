"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import { BRAND } from "@/lib/content";

// Three.js грузим только на клиенте
const GlobeScene = dynamic(() => import("@/components/three/GlobeScene"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      {/* 3D мир */}
      <div className="absolute inset-0 z-0">
        <GlobeScene />
      </div>

      {/* виньетка для читаемости */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-abyss via-abyss/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-abyss to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-28">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-peach/20 bg-peach/5 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-peach" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-peach">
              Global eSIM · 150+ стран
            </span>
          </motion.div>

          <h1 className="font-display text-hero text-ink">
            {BRAND.tagline.split(" ").map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease }}
                className="mr-[0.25em] inline-block"
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
            className="mt-6 max-w-md font-display text-xl leading-snug text-mist"
          >
            {BRAND.subtagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.62, ease }}
            className="mt-4 max-w-md font-mono text-sm leading-relaxed text-mist/70"
          >
            {BRAND.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.74, ease }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="#search">{BRAND.cta} →</MagneticButton>
            <MagneticButton href="#search" variant="ghost">
              {BRAND.ctaSecondary}
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* индикатор скролла */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-mist/40"
      >
        Scroll ↓
      </motion.div>
    </section>
  );
}
