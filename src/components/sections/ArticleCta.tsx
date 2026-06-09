import { PRICE_PER_GB, ESIM_SETUP_PRICE } from "@/lib/content";

/**
 * Компактный блок-призыв в конце статьи. Кнопка ведёт на /order.
 */
export default function ArticleCta() {
  return (
    <div className="mt-12 overflow-hidden rounded-3xl glass-strong p-8">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-peach/70">Sapsan eSIM</p>
      <h2 className="mt-3 font-display text-3xl leading-tight text-ink">
        Приземляйся на связи
      </h2>
      <p className="mt-3 max-w-md font-mono text-sm leading-relaxed text-mist/70">
        Глобальная eSIM с оплатой по мере использования — ${PRICE_PER_GB.toFixed(2)} за гигабайт.
        Открытие eSIM ${ESIM_SETUP_PRICE}. Работает при любых блокировках без VPN.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="/order"
          className="inline-flex items-center justify-center rounded-full bg-peach-grad px-7 py-3.5 font-mono text-sm font-semibold text-abyss shadow-glow-sm transition-transform hover:scale-[1.02]"
        >
          Купить eSIM →
        </a>
        <a
          href="/order"
          className="inline-flex items-center justify-center rounded-full glass px-7 py-3.5 font-mono text-sm text-ink transition-colors hover:border-peach/40"
        >
          Пополнить eSIM
        </a>
      </div>
    </div>
  );
}
