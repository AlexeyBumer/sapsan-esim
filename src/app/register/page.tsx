"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import { signUp } from "@/app/auth/actions";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  // Если перешли по реферальной ссылке (?ref=КОД) — подставляем код автоматически.
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setReferralCode(ref.toUpperCase());
  }, [searchParams]);

  async function action(formData: FormData) {
    setError("");
    setLoading(true);
    const res = await signUp(formData);
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
              Мы отправили письмо со ссылкой для подтверждения. Перейдите по ней, чтобы
              активировать аккаунт и войти.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block font-mono text-sm text-peach underline"
            >
              Перейти ко входу
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-section text-ink">Регистрация</h1>
            <p className="mt-3 font-mono text-sm text-mist/60">
              Создайте аккаунт Sapsan, чтобы управлять eSIM и балансом.
            </p>

            <form action={action} className="mt-8 space-y-4">
              <Field label="Email" name="email" type="email" placeholder="you@example.com" />
              <Field
                label="Пароль"
                name="password"
                type="password"
                placeholder="Минимум 8 символов"
              />
              <label className="block">
                <span className="font-mono text-xs uppercase tracking-widest text-mist/50">
                  Пригласительный код <span className="text-mist/30">(необязательно)</span>
                </span>
                <input
                  name="referralCode"
                  type="text"
                  placeholder="Например, A1B2C3D4"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-abyss/40 px-4 py-3 font-mono text-sm uppercase text-ink outline-none transition-colors focus:border-peach/40 placeholder:text-mist/30"
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
                {loading ? "Создаём…" : "Зарегистрироваться"}
              </button>
            </form>

            <p className="mt-6 text-center font-mono text-xs text-mist/50">
              Уже есть аккаунт?{" "}
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

function Field({
  label,
  name,
  type,
  placeholder,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-widest text-mist/50">{label}</span>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        autoComplete={type === "password" ? "new-password" : "email"}
        className="mt-2 w-full rounded-xl border border-white/10 bg-abyss/40 px-4 py-3 font-mono text-sm text-ink outline-none transition-colors focus:border-peach/40 placeholder:text-mist/30"
      />
    </label>
  );
}
