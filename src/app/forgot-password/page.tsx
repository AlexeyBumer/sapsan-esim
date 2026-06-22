"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/sections/Navbar";
import { resetPassword } from "@/app/auth/actions";

export default function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function action(formData: FormData) {
    setError("");
    setLoading(true);
    const res = await resetPassword(formData);
    setLoading(false);
    if (res?.error) setError(res.error);
    else if (res?.ok) setDone(true);
  }

  return (
    <main className="relative min-h-screen">
      <Navbar variant="auth" />
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-32">
        {done ? (
          <div className="rounded-3xl glass-strong p-8 text-center">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-peach/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="#ffdead" strokeWidth="2" className="h-8 w-8">
                <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
                <path d="m3.5 7 8.5 6 8.5-6" />
              </svg>
            </div>
            <h1 className="font-display text-2xl text-ink">Проверьте почту</h1>
            <p className="mt-3 font-mono text-sm leading-relaxed text-mist/70">
              Если такой аккаунт существует, мы отправили на него письмо со ссылкой для
              восстановления пароля. Письмо придёт с адреса support@sapsansim.com.
            </p>
            <Link href="/login" className="mt-6 inline-block font-mono text-sm text-peach underline">
              Перейти ко входу
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-section text-ink">Забыли пароль?</h1>
            <p className="mt-3 font-mono text-sm text-mist/60">
              Укажите email — пришлём ссылку для восстановления пароля.
            </p>

            <form action={action} className="mt-8 space-y-4">
              <label className="block">
                <span className="font-mono text-xs uppercase tracking-widest text-mist/50">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-abyss/40 px-4 py-3 font-mono text-sm text-ink outline-none transition-colors focus:border-peach/40 placeholder:text-mist/30"
                />
              </label>

              {error && (
                <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 font-mono text-xs text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-full bg-peach-grad py-3.5 font-mono text-sm font-semibold text-abyss shadow-glow-sm transition-transform enabled:hover:scale-[1.02] disabled:opacity-50"
              >
                {loading ? "Отправляем…" : "Отправить ссылку"}
              </button>
            </form>

            <p className="mt-6 text-center font-mono text-xs text-mist/50">
              Вспомнили пароль?{" "}
              <Link href="/login" className="text-peach underline">
                Войти
              </Link>
            </p>
          </>
        )}
      </section>
    </main>
  );
}
