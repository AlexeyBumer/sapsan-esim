"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Reveal } from "@/components/ui/Motion";

/**
 * Блок проверки совместимости с eSIM.
 * Анимированный мокап iPhone: набирается *#06#, затем появляется EID.
 */

const DIAL = ["*", "#", "0", "6", "#"];

function PhoneMockup() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [typed, setTyped] = useState("");
  const [showEid, setShowEid] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    setTyped("");
    setShowEid(false);
    const typer = setInterval(() => {
      if (i >= DIAL.length) {
        clearInterval(typer);
        setTimeout(() => setShowEid(true), 500);
        return;
      }
      i++;
      setTyped(DIAL.slice(0, i).join(""));
    }, 420);
    return () => clearInterval(typer);
  }, [inView]);

  return (
    <div ref={ref} className="relative mx-auto w-[260px] sm:w-[280px]">
      {/* свечение за телефоном */}
      <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-peach/10 blur-3xl" />

      {/* корпус iPhone */}
      <div className="relative aspect-[9/19] rounded-[2.6rem] border border-white/10 bg-gradient-to-b from-surface-2 to-abyss p-2.5 shadow-glow">
        <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-abyss">
          {/* динамический островок */}
          <div className="absolute left-1/2 top-3 z-20 h-6 w-20 -translate-x-1/2 rounded-full bg-black" />

          {/* статус-бар */}
          <div className="flex items-center justify-between px-6 pt-3.5 font-mono text-[10px] text-mist/80">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span>5G</span>
              <span className="inline-block h-2.5 w-4 rounded-[2px] border border-mist/60" />
            </span>
          </div>

          {/* экран набора */}
          <div className="flex h-full flex-col px-3.5 pb-6 pt-12">
            {/* поле ввода номера */}
            <div className="text-center">
              <p className="min-h-[2.5rem] whitespace-nowrap font-mono text-2xl tracking-tight text-ink">
                {typed}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                  className="ml-0.5 inline-block text-peach"
                >
                  |
                </motion.span>
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-mist/40">
                Набор номера
              </p>
            </div>

            {/* всплытие EID */}
            {showEid && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto mt-4 w-full rounded-2xl glass-strong p-4 text-center"
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-peach">EID</p>
                <p className="mt-1 break-all font-mono text-[11px] leading-relaxed text-ink">
                  89049032 0041 2071 8762 9531 8945 6720
                </p>
                <div className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[11px] text-peach">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Устройство совместимо
                </div>
              </motion.div>
            )}

            {/* клавиатура набора */}
            <div className="mt-auto grid grid-cols-3 gap-2.5 pt-4">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((k) => {
                const active = typed.includes(k) && (k === "*" || k === "0" || k === "6" || k === "#");
                return (
                  <div
                    key={k}
                    className={`grid h-9 place-items-center rounded-full font-mono text-base transition-colors duration-300 ${
                      active ? "bg-peach/20 text-peach" : "bg-white/5 text-mist/70"
                    }`}
                  >
                    {k}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EsimCheck() {
  return (
    <section id="check" className="relative mx-auto max-w-6xl px-6 py-32 scroll-mt-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-peach/70">
            Проверка совместимости
          </span>
          <h2 className="mt-3 font-display text-section text-ink">
            Поддерживает ли ваше устройство eSIM?
          </h2>
          <p className="mt-5 max-w-md font-mono text-sm leading-relaxed text-mist/70">
            Чтобы проверить поддержку eSIM, наберите{" "}
            <span className="rounded-md bg-peach/10 px-1.5 py-0.5 text-peach">*#06#</span> на
            телефоне. Если появится номер{" "}
            <span className="text-peach">EID</span> — устройство совместимо с Sapsan.
          </p>

          <div className="mt-8 space-y-3">
            <Stepline n="1" text="Откройте приложение «Телефон» и перейдите в набор номера." />
            <Stepline n="2" text="Введите код *#06# — он сработает автоматически." />
            <Stepline n="3" text="Появился EID — значит, eSIM поддерживается. Готово." />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <PhoneMockup />
        </Reveal>
      </div>
    </section>
  );
}

function Stepline({ n, text }: { n: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full border border-peach/30 font-mono text-xs text-peach">
        {n}
      </span>
      <p className="font-mono text-sm leading-relaxed text-mist/70">{text}</p>
    </div>
  );
}
