import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Сюда Supabase возвращает пользователя после клика по ссылке
 * подтверждения email (или сброса пароля). Обмениваем код на сессию.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/account";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      // Привязываем к новому аккаунту все гостевые заказы (user_id = null),
      // которые были сделаны на этот же email до регистрации.
      const email = data.user.email;
      if (email) {
        const admin = createAdminClient();
        const { error: linkError } = await admin
          .from("orders")
          .update({ user_id: data.user.id })
          .is("user_id", null)
          .ilike("payer_email", email);
        if (linkError) {
          console.error("Не удалось привязать гостевые заказы к аккаунту:", linkError);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Если что-то пошло не так — на страницу входа с пометкой
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
