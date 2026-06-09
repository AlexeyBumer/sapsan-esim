import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Если что-то пошло не так — на страницу входа с пометкой
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
