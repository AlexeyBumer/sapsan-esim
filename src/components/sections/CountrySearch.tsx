"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Motion";
import {
  DATA_PACKAGES,
  ESIM_SETUP_PRICE,
  PRICE_PER_GB,
  RF_NOTE,
  CONTACTS,
} from "@/lib/content";

export default function CountrySearch() {
  // по умолчанию выбран популярный пакет
  const popularIdx = DATA_PACKAGES.findIndex((p) => p.popular);
  const [selected, setSelected] = useState(popularIdx >= 0 ? popularIdx : 0);
  const pkg = DATA_PACKAGES[selected];

  return (
    <section id="search" className="relative mx-auto max-w-6xl px-6 py-32 scroll-mt-24">
      <Reveal className="text-center">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-peach/70">
          Тарифы
        </span>
        <h2 className="mx-auto mt-3 max-w-3xl font-display text-section text-ink">
          Выберите пакет трафика
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-mist/60">
          Единая цена по всему миру — ${PRICE_PER_GB.toFixed(2)} за гигабайт. Остаток не сгорает
          между поездками.
        </p>
      </Reveal>

      {/* Платёжные условия */}
      <Reveal delay={0.05}>
        <div
          id="pricing"
          className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-between gap-4 rounded-2xl glass-strong px-6 py-5 sm:flex-row scroll-mt-24"
        >
          <div className="flex items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-peach/10 font-display text-xl text-peach">
              ⬡
            </span>
            <div>
              <p className="font-mono text-lg font-semibold text-ink">
                Открытие eSIM — <span className="text-peach">${ESIM_SETUP_PRICE}</span>
              </p>
              <p className="font-mono text-xs text-mist/60">
                Единоразово + стоимость выбранного пакета трафика.
              </p>
            </div>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-mist/40">
            Платёжные условия
          </span>
        </div>
      </Reveal>

      {/* Сетка пакетов */}
      <Reveal delay={0.1}>
        <div className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {DATA_PACKAGES.map((p, i) => {
            const active = i === selected;
            return (
              <button
                key={p.gb}
                onClick={() => setSelected(i)}
                className={`group relative flex flex-col items-start rounded-2xl border p-5 text-left transition-all duration-300 ${
                  active
                    ? "border-peach/50 bg-peach/10 shadow-glow-sm"
                    : "border-white/10 glass hover:border-peach/30"
                }`}
              >
                {p.popular && (
                  <span className="absolute right-3 top-3 rounded-full bg-peach px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-abyss">
                    Хит
                  </span>
                )}
                <span className="font-mono text-3xl font-semibold text-ink">{p.gb}</span>
                <span className="font-mono text-xs uppercase tracking-widest text-mist/50">ГБ</span>
                <span
                  className={`mt-3 font-mono text-lg font-semibold ${
                    active ? "text-peach" : "text-mist"
                  }`}
                >
                  ${p.price.toFixed(2)}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Итог + покупка */}
      <Reveal delay={0.15}>
        <div className="mx-auto mt-6 max-w-4xl rounded-3xl glass-strong p-7">
          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-mist/50">
                Выбранный пакет
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold text-ink">
                {pkg.gb} ГБ — <span className="text-peach">${pkg.price.toFixed(2)}</span>
              </p>
              <p className="mt-1 font-mono text-xs text-mist/50">
                + открытие eSIM ${ESIM_SETUP_PRICE}. Итого: ${(pkg.price + ESIM_SETUP_PRICE).toFixed(2)}
              </p>
            </div>
            <a
              href={CONTACTS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-full bg-peach-grad px-8 py-3.5 font-mono text-sm font-semibold text-abyss shadow-glow-sm transition-transform hover:scale-[1.02] sm:w-auto"
            >
              Купить {pkg.gb} ГБ
            </a>
          </div>

          {/* Блок про РФ / VPN */}
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-peach/20 bg-peach/5 px-5 py-4">
            <span className="mt-0.5 text-lg">🇷🇺</span>
            <p className="font-mono text-xs leading-relaxed text-peach/90">{RF_NOTE}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
