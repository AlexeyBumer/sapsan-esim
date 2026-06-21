import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/FaqContactFooter";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: "Личный кабинет",
  robots: { index: false, follow: false },
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Ожидает оплаты",
  paid: "Оплачен — ожидает активации",
  failed: "Не оплачен",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code, balance_usd, email")
    .eq("id", user.id)
    .single();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, mode, package_gb, amount_usd, payment_status, esim_id, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="relative">
      <Navbar />
      <section className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-peach/70">
              Личный кабинет
            </span>
            <h1 className="mt-2 font-display text-section text-ink">Привет!</h1>
            <p className="mt-1 font-mono text-sm text-mist/60">{user.email}</p>
          </div>
          <form action={signOut}>
            <button className="rounded-full glass px-5 py-2.5 font-mono text-xs text-mist/70 transition-colors hover:text-peach">
              Выйти
            </button>
          </form>
        </div>

        <div className="mt-10 rounded-3xl glass-strong p-7">
          <p className="font-mono text-xs uppercase tracking-widest text-mist/50">Баланс</p>
          <p className="mt-2 font-mono text-4xl font-semibold text-grad">
            ${Number(profile?.balance_usd ?? 0).toFixed(2)}
          </p>
          <p className="mt-2 font-mono text-xs text-mist/50">
            Пополнение баланса и вывод появятся на следующем этапе.
          </p>
        </div>

        <div className="mt-5 rounded-3xl glass p-7">
          <p className="font-mono text-xs uppercase tracking-widest text-mist/50">Мои заказы</p>
          {orders && orders.length > 0 ? (
            <div className="mt-4 space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-ink">
                      {order.mode === "topup" ? "Пополнение" : "Новая eSIM"} — {order.package_gb} ГБ
                    </span>
                    <span className="font-mono text-xs text-peach">
                      ${Number(order.amount_usd).toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-xs text-mist/50">
                    {STATUS_LABELS[order.payment_status] ?? order.payment_status}
                    {order.esim_id ? ` · eSIM ID: ${order.esim_id}` : ""}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 font-mono text-sm text-mist/70">
              Здесь появятся ваши оплаченные eSIM с их ID. Пока вы можете оформить новую.
            </p>
          )}
          <a href="/order" className="mt-5 inline-flex items-center justify-center rounded-full bg-peach-grad px-7 py-3 font-mono text-sm font-semibold text-abyss shadow-glow-sm transition-transform hover:scale-[1.02]">
            Купить eSIM →
          </a>
        </div>

        <div className="mt-5 rounded-3xl glass p-7">
          <p className="font-mono text-xs uppercase tracking-widest text-mist/50">
            Ваш реферальный код
          </p>
          <p className="mt-2 font-mono text-2xl text-peach">{profile?.referral_code ?? "—"}</p>
          <p className="mt-3 font-mono text-xs leading-relaxed text-mist/60">
            Реферальная программа подключается на следующем этапе: за друзей, которые оформят eSIM,
            будет начисляться вознаграждение на баланс.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
