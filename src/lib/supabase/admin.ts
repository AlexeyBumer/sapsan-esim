import { createClient } from "@supabase/supabase-js";

/**
 * Административный клиент Supabase с service_role-ключом.
 * ⚠️ ТОЛЬКО для сервера (API-роуты, вебхуки). НИКОГДА не импортировать
 * в клиентские компоненты — ключ обходит RLS и даёт полный доступ к базе.
 *
 * Используется для привилегированных операций: начисление реферальных бонусов,
 * изменение баланса — то, что инициирует сервер после проверки оплаты,
 * а не сам пользователь.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Не заданы NEXT_PUBLIC_SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY.");
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
