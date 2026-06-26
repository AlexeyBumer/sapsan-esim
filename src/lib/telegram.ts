import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Уведомления операторам в Telegram о новых оплаченных заказах.
 * Шлём только тем chat_id, у кого сейчас активна сессия в admin_sessions
 * (то есть кто прошёл /login <пароль> в боте и срок ещё не истёк).
 */

const TELEGRAM_API = (token: string) => `https://api.telegram.org/bot${token}`;

export async function sendTelegramMessage(chatId: number | string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("TELEGRAM_BOT_TOKEN не задан");
    return;
  }

  const res = await fetch(`${TELEGRAM_API(token)}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Telegram sendMessage failed:", res.status, errorText);

    // Защита от тихого молчания бота: если Telegram отбил сообщение из-за
    // HTML-разметки (например, в тексте случайно оказались символы < >,
    // которые он принял за недопустимый тег) — переотправляем тот же текст
    // уже без parse_mode, чтобы оператор всё равно получил уведомление.
    if (res.status === 400 && errorText.includes("can't parse entities")) {
      const retry = await fetch(`${TELEGRAM_API(token)}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
      if (!retry.ok) {
        console.error("Telegram sendMessage повторная отправка тоже не удалась:", retry.status, await retry.text());
      }
    }
  }
}

export async function getAuthorizedAdminChatIds(): Promise<number[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("admin_sessions")
    .select("chat_id, authorized_until")
    .gt("authorized_until", new Date().toISOString());

  if (error) {
    console.error("Не удалось получить admin_sessions:", error);
    return [];
  }

  return (data ?? []).map((row) => Number(row.chat_id));
}

export async function notifyAuthorizedAdmins(text: string) {
  const chatIds = await getAuthorizedAdminChatIds();

  if (chatIds.length === 0) {
    console.warn("Нет авторизованных операторов — уведомление не отправлено:", text);
    return;
  }

  await Promise.all(chatIds.map((id) => sendTelegramMessage(id, text)));
}
