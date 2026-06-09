import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/FaqContactFooter";
import { CONTACTS } from "@/lib/content";
import CopyId from "./CopyId";

export const metadata: Metadata = {
  title: "Оплата получена",
  robots: { index: false, follow: false }, // страницу успеха не индексируем
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; mode?: string; gb?: string }>;
}) {
  const params = await searchParams;
  const id = params.id || "—";
  const mode = params.mode === "topup" ? "topup" : "new";
  const gb = params.gb || "";

  const tgText = encodeURIComponent(
    mode === "new"
      ? `Здравствуйте! Оплатил новую eSIM. Мой ID заказа: ${id}. Объём: ${gb} ГБ. Прилагаю скрин оплаты.`
      : `Здравствуйте! Пополнил eSIM. ID заказа: ${id}. Объём: ${gb} ГБ. Прилагаю скрин оплаты.`
  );
  const tgLink = `${CONTACTS.telegram}?text=${tgText}`;

  return (
    <main className="relative">
      <Navbar />
      <section className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-6 py-32 text-center">
        {/* галочка */}
        <div className="relative mb-8 grid h-20 w-20 place-items-center rounded-full bg-peach/10">
          <span className="absolute inset-0 animate-pulse-ring rounded-full border border-peach/40" />
          <svg viewBox="0 0 24 24" fill="none" stroke="#ffdead" strokeWidth="2.5" className="h-9 w-9">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className="font-display text-section text-ink">Оплата получена</h1>
        <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-mist/70">
          Спасибо! Ваш заказ принят. Ниже — ваш ID eSIM. Сохраните его: по нему оператор активирует
          или пополнит вашу eSIM, и по нему вы сможете пополнять её в будущем.
        </p>

        {/* ID */}
        <div className="mt-8 w-full max-w-md rounded-2xl glass-strong p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-mist/50">Ваш ID eSIM</p>
          <CopyId id={id} />
        </div>

        {/* Инструкция */}
        <div className="mt-6 w-full max-w-md rounded-2xl border border-peach/20 bg-peach/5 p-6 text-left">
          <p className="font-mono text-sm font-semibold text-peach">Последний шаг</p>
          <ol className="mt-3 space-y-2 font-mono text-xs leading-relaxed text-mist/80">
            <li>1. Сделайте скриншот успешной оплаты.</li>
            <li>2. Напишите оператору {CONTACTS.telegramHandle} и пришлите скрин вместе с вашим ID.</li>
            <li>3. Оператор активирует eSIM и пришлёт инструкцию по установке.</li>
          </ol>
          <a
            href={tgLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-peach-grad py-3.5 font-mono text-sm font-semibold text-abyss shadow-glow-sm transition-transform hover:scale-[1.02]"
          >
            Написать оператору {CONTACTS.telegramHandle}
          </a>
        </div>

        <a href="/" className="mt-8 font-mono text-xs text-mist/50 underline hover:text-peach">
          Вернуться на главную
        </a>
      </section>
      <Footer />
    </main>
  );
}
