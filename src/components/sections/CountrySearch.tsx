"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/Motion";
import { COUNTRY_RATES, ESIM_SETUP_PRICE, CONTACTS, type CountryRate } from "@/lib/content";

export default function CountrySearch() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<CountryRate>(COUNTRY_RATES[0]);

  const results = useMemo(() => {
    if (!query) return COUNTRY_RATES.slice(0, 7);
    return COUNTRY_RATES.filter((c) =>
      c.country.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const cheapest = Math.min(...selected.operators.map((o) => o.price));

  return (
    <section id="search" className="relative mx-auto max-w-6xl px-6 py-32 scroll-mt-24">
      <Reveal className="text-center">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-peach/70">
          Стоимость интернета
        </span>
        <h2 className="mx-auto mt-3 max-w-3xl font-display text-section text-ink">
          Стабильное и быстрое соединение по всему миру
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-mist/60">
          Цена зависит от страны и оператора. eSIM подключается к лучшей локальной сети.
          Проверьте тариф ниже.
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
                Единоразово + далее оплата строго по тарифу за фактический трафик.
              </p>
            </div>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-mist/40">
            Платёжные условия
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-6 grid max-w-4xl gap-5 lg:grid-cols-[1fr_1.1fr]">
          {/* поиск */}
          <div className="rounded-3xl glass p-6">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-abyss/40 px-4 py-3.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-peach">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4-4" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Введите название страны"
                className="w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-mist/40"
              />
            </div>
            <div className="mt-4 max-h-80 space-y-1 overflow-y-auto pr-1">
              {results.map((c) => {
                const min = Math.min(...c.operators.map((o) => o.price));
                return (
                  <button
                    key={c.country}
                    onClick={() => setSelected(c)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors ${
                      selected.country === c.country
                        ? "bg-peach/10 text-ink"
                        : "text-mist/70 hover:bg-white/5"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{c.flag}</span>
                      <span className="font-mono text-sm">{c.country}</span>
                    </span>
                    <span className="font-mono text-sm text-peach">от ${min.toFixed(2)}/ГБ</span>
                  </button>
                );
              })}
              {results.length === 0 && (
                <p className="px-4 py-6 text-center font-mono text-sm text-mist/40">
                  Страна не найдена
                </p>
              )}
            </div>
          </div>

          {/* карточка-результат */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.country}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl glass-strong p-7"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selected.flag}</span>
                  <h3 className="font-display text-2xl leading-tight text-ink">{selected.country}</h3>
                </div>
                <span className="rounded-full border border-peach/30 px-3 py-1 font-mono text-xs text-peach">
                  {selected.speed}
                </span>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-4">
                <Metric label="От, за 1 ГБ" value={`$${cheapest.toFixed(2)}`} accent />
                <Metric label="Покрытие" value={`${selected.coverage}%`} />
              </div>

              <div className="mt-6">
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-mist/50">
                  Операторы · цена за 1 ГБ
                </p>
                <div className="space-y-1.5">
                  {selected.operators.map((op) => (
                    <div
                      key={op.name}
                      className="flex items-center justify-between rounded-lg bg-abyss/40 px-3 py-2"
                    >
                      <span className="font-mono text-sm text-mist">{op.name}</span>
                      <span className="font-mono text-sm text-peach">${op.price.toFixed(2)}/ГБ</span>
                    </div>
                  ))}
                </div>
              </div>

              {selected.note && (
                <p className="mt-5 rounded-xl border border-peach/20 bg-peach/5 px-4 py-3 font-mono text-xs leading-relaxed text-peach/90">
                  {selected.note}
                </p>
              )}

              <a
                href={CONTACTS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center rounded-full bg-peach-grad py-3.5 font-mono text-sm font-semibold text-abyss shadow-glow-sm transition-transform hover:scale-[1.02]"
              >
                Купить eSIM для {selected.countryGenitive}
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl bg-abyss/40 p-4">
      <p className="font-mono text-xs uppercase tracking-widest text-mist/50">{label}</p>
      <p className={`mt-1 font-mono text-2xl font-semibold sm:text-3xl ${accent ? "text-peach" : "text-ink"}`}>{value}</p>
    </div>
  );
}
