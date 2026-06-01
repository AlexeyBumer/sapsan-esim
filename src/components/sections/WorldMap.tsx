"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Motion";

/**
 * Карта покрытия с узнаваемыми силуэтами континентов (без текстур).
 * viewBox 1000x500. При наведении регион подсвечивается, дуги связи усиливаются.
 */
type Region = { id: string; name: string; countries: number; hub: [number, number]; path: string };

const REGIONS: Region[] = [
  { id: "na", name: "Северная Америка", countries: 23, hub: [205, 175],
    path: "M90 80 L210 70 L290 95 L270 140 L300 150 L250 200 L235 260 L205 255 L195 215 L150 195 L165 160 L120 150 L110 110 Z" },
  { id: "sa", name: "Южная Америка", countries: 14, hub: [305, 360],
    path: "M270 280 L320 285 L335 330 L320 390 L300 430 L280 410 L285 360 L260 330 L268 295 Z" },
  { id: "eu", name: "Европа", countries: 44, hub: [505, 150],
    path: "M460 110 L545 100 L560 135 L535 165 L555 185 L505 195 L470 175 L455 145 Z" },
  { id: "af", name: "Африка", countries: 31, hub: [520, 300],
    path: "M470 200 L560 195 L585 240 L575 300 L540 360 L505 370 L490 320 L465 270 L470 230 Z" },
  { id: "me", name: "Ближний Восток", countries: 12, hub: [600, 220],
    path: "M575 185 L630 190 L650 225 L625 255 L590 250 L575 215 Z" },
  { id: "as", name: "Азия", countries: 28, hub: [720, 175],
    path: "M575 95 L720 80 L820 110 L850 160 L800 200 L720 210 L660 185 L640 150 L580 145 L565 115 Z" },
  { id: "oc", name: "Океания", countries: 8, hub: [830, 370],
    path: "M790 340 L860 335 L885 370 L855 400 L805 395 L785 365 Z" },
];

export default function WorldMap() {
  const [hover, setHover] = useState<string | null>(null);
  const active = REGIONS.find((r) => r.id === hover) ?? null;

  return (
    <section id="map" className="relative mx-auto max-w-6xl px-6 py-32 scroll-mt-24">
      <Reveal className="text-center">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-peach/70">Карта покрытия</span>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-section text-ink">Одна сеть. Весь мир.</h2>
        <p className="mx-auto mt-4 max-w-lg font-mono text-sm text-mist/60">
          Наведите на регион, чтобы увидеть число поддерживаемых стран.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="relative mt-14 overflow-hidden rounded-3xl glass p-4 sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
          <div className="relative w-full">
            <svg viewBox="0 0 1000 500" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="contFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#103838" /><stop offset="100%" stopColor="#0d2f2f" />
                </linearGradient>
                <linearGradient id="contHover" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1f4d4d" /><stop offset="100%" stopColor="#103838" />
                </linearGradient>
                <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#1f4d4d" opacity="0.35" />
                </pattern>
              </defs>
              <rect width="1000" height="500" fill="url(#dots)" />

              {REGIONS.map((r, i) =>
                REGIONS.slice(i + 1).map((r2) => {
                  const [x1, y1] = r.hub; const [x2, y2] = r2.hub;
                  const mx = (x1 + x2) / 2; const my = Math.min(y1, y2) - 70;
                  const lit = hover === r.id || hover === r2.id;
                  return (
                    <path key={`${r.id}-${r2.id}`} d={`M${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                      fill="none" stroke="#ffdead" strokeWidth={lit ? 1.4 : 0.8}
                      opacity={lit ? 0.55 : 0.07} className="transition-all duration-300" />
                  );
                })
              )}

              {REGIONS.map((r) => {
                const isOn = hover === r.id;
                return (
                  <path key={r.id} d={r.path}
                    fill={isOn ? "url(#contHover)" : "url(#contFill)"}
                    stroke={isOn ? "#ffdead" : "#1f4d4d"} strokeWidth={isOn ? 1.6 : 1}
                    strokeLinejoin="round" onMouseEnter={() => setHover(r.id)} onMouseLeave={() => setHover(null)}
                    className="cursor-pointer transition-all duration-300"
                    style={{ filter: isOn ? "drop-shadow(0 0 12px rgba(255,222,173,0.4))" : "none" }} />
                );
              })}

              {REGIONS.map((r) => (
                <g key={`hub-${r.id}`} className="pointer-events-none">
                  <circle cx={r.hub[0]} cy={r.hub[1]} r="14" fill="#ffdead" opacity="0.12">
                    <animate attributeName="r" values="8;20;8" dur="2.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0;0.2" dur="2.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={r.hub[0]} cy={r.hub[1]} r="4" fill="#ffdead" />
                </g>
              ))}
            </svg>

            {active && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-[130%] rounded-xl glass-strong px-4 py-2"
                style={{ left: `${(active.hub[0] / 1000) * 100}%`, top: `${(active.hub[1] / 500) * 100}%` }}>
                <p className="whitespace-nowrap font-display text-sm text-ink">{active.name}</p>
                <p className="font-mono text-xs text-peach">{active.countries} стран</p>
              </motion.div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
