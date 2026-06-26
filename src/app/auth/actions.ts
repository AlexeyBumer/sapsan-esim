"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
  const referralCode = String(formData.get("referralCode") || "").trim().toUpperCase();

  if (!email || !password) {
    return { error: "Введите email и пароль." };
  }
  if (password.length < 8) {
    return { error: "Пароль должен быть не короче 8 символов." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${originUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { error: translateError(error.message) };
  }

  // Привязка к рефереру: профиль уже создан триггером БД (handle_new_user),
  // но без referred_by — заполняем его отдельно через service_role,
  // если введённый код существует и принадлежит не самому пользователю.
  if (referralCode && data.user) {
    try {
      const admin = createAdminClient();
      const { data: referrer } = await admin
        .from("profiles")
        .select("id")
        .eq("referral_code", referralCode)
        .maybeSingle();

      if (referrer && referrer.id !== data.user.id) {
        await admin
          .from("profiles")
          .update({ referred_by: referrer.id })
          .eq("id", data.user.id);

        // Лог: кто кого пригласил и когда — для отображения в /account
        // и как аудит-след, независимо от того, купит ли друг что-то.
        await admin.from("referral_log").insert({
          referrer_id: referrer.id,
          referred_id: data.user.id,
          referred_email: email,
        });
      }
    } catch (e) {
      console.error("Не удалось привязать реферальный код:", e);
    }
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
    redirectTo: `${originUrl()}/auth/callback?type=recovery&next=/reset-password`,
  });
  if (error) return { error: translateError(error.message) };
  return { ok: true };
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (password.length < 8) {
    return { error: "Пароль должен быть не короче 8 символов." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: translateError(error.message) };

  revalidatePath("/", "layout");
  redirect("/account");
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
