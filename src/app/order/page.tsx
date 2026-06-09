import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/FaqContactFooter";
import OrderForm from "@/components/sections/OrderForm";

export const metadata: Metadata = {
  title: "Оформление заказа",
  description: "Купите или пополните eSIM Sapsan. Оплата онлайн, активация после подтверждения.",
};

export default function OrderPage() {
  return (
    <main className="relative">
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-32">
        <div className="mb-10 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-peach/70">
            Оформление
          </span>
          <h1 className="mt-3 font-display text-section text-ink">Купить или пополнить eSIM</h1>
          <p className="mx-auto mt-4 max-w-md font-mono text-sm text-mist/60">
            Выберите тип заказа и объём трафика. Цена — $1.99 за ГБ.
          </p>
        </div>
        <OrderForm />
      </section>
      <Footer />
    </main>
  );
}
