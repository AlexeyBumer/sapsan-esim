"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DATA_PACKAGES, PRICE_PER_GB, ESIM_SETUP_PRICE, CONTACTS } from "@/lib/content";

type Mode = "new" | "topup";

export default function OrderForm({ isGuest = false }: { isGuest?: boolean }) {
  const [mode, setMode] = useState<Mode>("new");
  const [email, setEmail] = useState("");
  const [esimId, setEsimId] = useState("");
  const [selectedGb, setSelectedGb] = useState<number>(15);
  const [customMode, setCustomMode] = useState(false);
  const [customGb, setCustomGb] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Предвыбор пакета из ?gb= и реферального кода из ?ref= в адресе
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const g = Number(sp.get("gb"));
    if (g && DATA_PACKAGES.some((p) => p.gb === g)) {
      setSelectedGb(g);
    } else if (g && g >= 1 && g <= 500) {
      setCustomMode(true);
      setCustomGb(String(g));
    }
    const ref = sp.get("ref");
    if (ref) setReferralCode(ref.toUpperCase());
  }, []);

  const gb = customMode ? Number(customGb) || 0 : selectedGb;

  const total = useMemo(() => {
    const traffic = gb * PRICE_PER_GB;
    const setup = mode === "new" ? ESIM_SETUP_PRICE : 0;
    return { traffic, setup, sum: traffic + setup };
  }, [gb, mode]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit =
    gb >= 1 &&
    gb <= 500 &&
    (mode === "new" ? emailValid : esimId.trim().length >= 3);

  async function handlePay() {
    setError("");
    if (!canSubmit) {
      setError(
        mode === "new"
          ? "Введите корректный email и количество ГБ."
          : "Укажите ID eSIM и количество ГБ."
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, email, esimId, gb, referralCode }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Не удалось создать счёт.");
      }
      // Редирект на страницу оплаты Heleket
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка. Попробуйте ещё раз.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* Переключатель: новая / пополнить */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl glass p-1.5">
        {(["new", "topup"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-xl py-3 font-mono text-sm transition-colors ${
              mode === m ? "bg-peach text-abyss font-semibold" : "text-mist/70 hover:text-ink"
            }`}
          >
            {m === "new" ? "Новая eSIM" : "Пополнить eSIM"}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-3xl glass-strong p-6 sm:p-8">
        {/* Email или ID */}
        {mode === "new" ? (
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-widest text-mist/50">
              Email (на него закрепим eSIM)
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-white/10 bg-abyss/40 px-4 py-3 font-mono text-sm text-ink outline-none transition-colors focus:border-peach/40 placeholder:text-mist/30"
            />
          </label>
        ) : (
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-widest text-mist/50">
              ID вашей eSIM
            </span>
            <input
              value={esimId}
              onChange={(e) => setEsimId(e.target.value)}
              placeholder="SAP-..."
              className="mt-2 w-full rounded-xl border border-white/10 bg-abyss/40 px-4 py-3 font-mono text-sm text-ink outline-none transition-colors focus:border-peach/40 placeholder:text-mist/30"
            />
            <span className="mt-1.5 block font-mono text-[11px] text-mist/40">
              ID вы получили при покупке. Не помните — напишите оператору {CONTACTS.telegramHandle}.
            </span>
          </label>
        )}

        {/* Выбор тарифа */}
        <div className="mt-6">
          <span className="font-mono text-xs uppercase tracking-widest text-mist/50">
            Объём трафика
          </span>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {DATA_PACKAGES.map((p) => {
              const active = !customMode && selectedGb === p.gb;
              return (
                <button
                  key={p.gb}
                  onClick={() => {
                    setCustomMode(false);
                    setSelectedGb(p.gb);
                  }}
                  className={`rounded-xl border py-3 font-mono transition-all ${
                    active
                      ? "border-peach/50 bg-peach/10 text-peach"
                      : "border-white/10 text-mist/70 hover:border-peach/30"
                  }`}
                >
                  <span className="block text-lg font-semibold">{p.gb}</span>
                  <span className="block text-[10px] uppercase tracking-wider opacity-70">ГБ</span>
                </button>
              );
            })}
            {/* Своё значение */}
            <button
              onClick={() => setCustomMode(true)}
              className={`col-span-3 rounded-xl border py-3 font-mono text-sm transition-all sm:col-span-4 ${
                customMode
                  ? "border-peach/50 bg-peach/10 text-peach"
                  : "border-white/10 text-mist/70 hover:border-peach/30"
              }`}
            >
              Своё значение
            </button>
          </div>

          {customMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3"
            >
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-abyss/40 px-4 py-3">
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
            </motion.div>
          )}
        </div>

        {/* Пригласительный код — только для гостей без аккаунта */}
        {isGuest && (
          <label className="mt-6 block">
            <span className="font-mono text-xs uppercase tracking-widest text-mist/50">
              Пригласительный код <span className="text-mist/30">(необязательно)</span>
            </span>
            <input
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              placeholder="Например, A1B2C3D4"
              className="mt-2 w-full rounded-xl border border-white/10 bg-abyss/40 px-4 py-3 font-mono text-sm uppercase text-ink outline-none transition-colors focus:border-peach/40 placeholder:text-mist/30"
            />
          </label>
        )}

        {/* Итог */}
        <div className="mt-6 space-y-1.5 rounded-2xl bg-abyss/40 p-4 font-mono text-sm">
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
          className="mt-5 flex w-full items-center justify-center rounded-full bg-peach-grad py-4 font-mono text-sm font-semibold text-abyss shadow-glow-sm transition-transform enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Создаём счёт…" : `Перейти к оплате · $${total.sum.toFixed(2)}`}
        </button>

        <p className="mt-3 text-center font-mono text-[11px] leading-relaxed text-mist/40">
          Оплата проходит через защищённую платёжную систему. После оплаты вы вернётесь на сайт
          с вашим ID eSIM.
        </p>
      </div>
    </div>
  );
}
