import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Клиент Supabase для сервера (серверные компоненты, роуты, действия).
 * Читает сессию пользователя из защищённых cookie.
 * Тоже использует anon-ключ + RLS — никаких секретов в браузере.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // вызывается из серверного компонента — игнорируем,
            // сессию обновит middleware
          }
        },
      },
    }
  );
}
