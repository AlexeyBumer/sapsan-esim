"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/sections/Navbar";
import { signIn } from "@/app/auth/actions";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function action(formData: FormData) {
    setError("");
    setLoading(true);
    const res = await signIn(formData);
    // при успехе signIn делает redirect, сюда попадаем только при ошибке
    setLoading(false);
    if (res?.error) setError(res.error);
  }

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-32">
        <h1 className="font-display text-section text-ink">Вход</h1>
        <p className="mt-3 font-mono text-sm text-mist/60">
          Войдите в личный кабинет Sapsan.
        </p>

        <form action={action} className="mt-8 space-y-4">
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-widest text-mist/50">Email</span>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-white/10 bg-abyss/40 px-4 py-3 font-mono text-sm text-ink outline-none transition-colors focus:border-peach/40 placeholder:text-mist/30"
            />
          </label>
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-widest text-mist/50">Пароль</span>
            <input
              name="password"
              type="password"
              required
              placeholder="Ваш пароль"
              autoComplete="current-password"
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
            {loading ? "Входим…" : "Войти"}
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-xs text-mist/50">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-peach underline">
            Зарегистрироваться
          </Link>
        </p>
      </section>
    </main>
  );
}
