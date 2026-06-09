"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Серверные действия авторизации.
 * Пароли обрабатывает Supabase, мы их не видим и не храним.
 */

function originUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://www.sapsansim.com";
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Введите email и пароль." };
  }
  if (password.length < 8) {
    return { error: "Пароль должен быть не короче 8 символов." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${originUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { error: translateError(error.message) };
  }
  return { ok: true };
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: translateError(error.message) };
  }
  revalidatePath("/", "layout");
  redirect("/account");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function resetPassword(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  if (!email) return { error: "Введите email." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${originUrl()}/auth/callback?type=recovery`,
  });
  if (error) return { error: translateError(error.message) };
  return { ok: true };
}

// Понятные сообщения вместо технических
function translateError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("already registered")) return "Этот email уже зарегистрирован.";
  if (m.includes("invalid login")) return "Неверный email или пароль.";
  if (m.includes("email not confirmed")) return "Подтвердите email — письмо отправлено на почту.";
  if (m.includes("rate limit")) return "Слишком много попыток. Подождите немного.";
  return "Не удалось выполнить. Попробуйте ещё раз.";
}
