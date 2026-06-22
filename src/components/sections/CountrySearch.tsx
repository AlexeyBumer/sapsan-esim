"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/Motion";
import {
  DATA_PACKAGES,
  ESIM_SETUP_PRICE,
  PRICE_PER_GB,
  RF_NOTE,
  CONTACTS,
} from "@/lib/content";

type Mode = "new" | "topup";

// варианты слева: пакеты + «своё значение»
type Choice = { kind: "pkg"; gb: number; popular?: boolean } | { kind: "custom" };

const CHOICES: Choice[] = [
  ...DATA_PACKAGES.map((p) => ({ kind: "pkg" as const, gb: p.gb, popular: p.popular })),
  { kind: "custom" as const },
];

export default function CountrySearch() {
  const popularIdx = CHOICES.findIndex((c) => c.kind === "pkg" && c.popular);
  const [selIdx, setSelIdx] = useState(popularIdx >= 0 ? popularIdx : 0);
  const [customGb, setCustomGb] = useState("");
  const [mode, setMode] = useState<Mode>("new");
  const [email, setEmail] = useState("");
  const [esimId, setEsimId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const choice = CHOICES[selIdx];
  const isCustom = choice.kind === "custom";
  const gb = isCustom ? Number(customGb) || 0 : (choice as { gb: number }).gb;

  const total = useMemo(() => {
    const traffic = gb * PRICE_PER_GB;
    const setup = mode === "new" ? ESIM_SETUP_PRICE : 0;
    return { traffic, setup, sum: traffic + setup };
  }, [gb, mode]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit =
    gb >= 1 && gb <= 500 && (mode === "new" ? emailValid : esimId.trim().length >= 3);

  async function handlePay() {
    setError("");
    if (!canSubmit) {
      setError(
        mode === "new"
          ? "Введите корректный email и объём трафика."
          : "Укажите ID eSIM и объём трафика."
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, email, esimId, gb }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Не удалось создать счёт.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка. Попробуйте ещё раз.");
      setLoading(false);
    }
  }

  return (
    <section id="search" className="relative mx-auto max-w-6xl px-6 py-32 scroll-mt-24">
      <Reveal className="text-center">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-peach/70">Тарифы</span>
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

      {/* Двухколоночный блок: слева выбор, справа детали + оплата */}
      <Reveal delay={0.1}>
        <div className="mx-auto mt-6 grid max-w-4xl gap-5 lg:grid-cols-[1fr_1.1fr]">
          {/* СЛЕВА: список пакетов + своё значение */}
          <div className="rounded-3xl glass p-6">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-mist/50">
              Объём трафика
            </p>
            <div className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
              {CHOICES.map((c, i) => {
                const active = i === selIdx;
                if (c.kind === "custom") {
                  return (
                    <button
                      key="custom"
                      onClick={() => setSelIdx(i)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors ${
                        active ? "bg-peach/10 text-ink" : "text-mist/70 hover:bg-white/5"
                      }`}
                    >
                      <span className="font-mono text-sm">Своё значение</span>
                      <span className="font-mono text-xs text-peach">от 1 ГБ</span>
                    </button>
                  );
                }
                return (
                  <button
                    key={c.gb}
                    onClick={() => setSelIdx(i)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors ${
                      active ? "bg-peach/10 text-ink" : "text-mist/70 hover:bg-white/5"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-mono text-sm">
                      {c.gb} ГБ
                      {c.popular && (
                        <span className="rounded-full bg-peach px-2 py-0.5 text-[9px] uppercase tracking-wider text-abyss">
                          Хит
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-sm text-peach">
                      ${(c.gb * PRICE_PER_GB).toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* поле своего значения */}
            {isCustom && (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-abyss/40 px-4 py-3">
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={customGb}
                  onChange={(e) => setCustomGb(e.target.value)}
                  placeholder="Сколько ГБ?"
                  className="w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-mist/30"
                />
                <span className="font-mono text-sm text-mist/50">ГБ × ${PRICE_PER_GB}</span>
              </div>
            )}
          </div>

          {/* СПРАВА: детали + оплата */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isCustom ? "custom" : (choice as { gb: number }).gb}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl glass-strong p-7"
            >
              {/* тип заказа */}
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-abyss/40 p-1.5">
                {(["new", "topup"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`rounded-xl py-2.5 font-mono text-xs transition-colors ${
                      mode === m ? "bg-peach text-abyss font-semibold" : "text-mist/70 hover:text-ink"
                    }`}
                  >
                    {m === "new" ? "Новая eSIM" : "Пополнить"}
                  </button>
                ))}
              </div>

              {/* email или ID */}
              <div className="mt-4">
                {mode === "new" ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ваш email"
                    className="w-full rounded-xl border border-white/10 bg-abyss/40 px-4 py-3 font-mono text-sm text-ink outline-none transition-colors focus:border-peach/40 placeholder:text-mist/30"
                  />
                ) : (
                  <input
                    value={esimId}
                    onChange={(e) => setEsimId(e.target.value)}
                    placeholder="ID вашей eSIM (SAP-...)"
                    className="w-full rounded-xl border border-white/10 bg-abyss/40 px-4 py-3 font-mono text-sm text-ink outline-none transition-colors focus:border-peach/40 placeholder:text-mist/30"
                  />
                )}
              </div>

              {/* итог */}
              <div className="mt-5 space-y-1.5 rounded-2xl bg-abyss/40 p-4 font-mono text-sm">
                <div className="flex justify-between text-mist/70">
                  <span>Трафик: {gb || 0} ГБ × ${PRICE_PER_GB}</span>
                  <span>${total.traffic.toFixed(2)}</span>
                </div>
                {mode === "new" && (
                  <div className="flex justify-between text-mist/70">
                    <span>Открытие eSIM</span>
                    <span>${total.setup.toFixed(2)}</span>
                  </div>
                )}
                <div className="mt-2 flex justify-between border-t border-white/10 pt-2 text-ink">
                  <span className="font-semibold">Итого</span>
                  <span className="font-semibold text-peach">${total.sum.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 font-mono text-xs text-red-300">
                  {error}
                </p>
              )}

              <button
                onClick={handlePay}
                disabled={loading || !canSubmit}
                className="mt-5 flex w-full items-center justify-center rounded-full bg-peach-grad py-3.5 font-mono text-sm font-semibold text-abyss shadow-glow-sm transition-transform enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Создаём счёт…" : `Перейти к оплате · $${total.sum.toFixed(2)}`}
              </button>

              {/* блок про РФ / VPN */}
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-peach/20 bg-peach/5 px-4 py-3">
                <span className="mt-0.5 text-base">🇷🇺</span>
                <p className="font-mono text-[11px] leading-relaxed text-peach/90">{RF_NOTE}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
