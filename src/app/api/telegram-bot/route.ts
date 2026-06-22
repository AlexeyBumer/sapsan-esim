import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTelegramMessage } from "@/lib/telegram";

export const runtime = "nodejs";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const SESSION_HOURS = 24;

interface TelegramUpdate {
  message?: { chat: { id: number }; text?: string };
}

export async function POST(req: Request) {
  const adminPassword = process.env.TELEGRAM_ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("TELEGRAM_ADMIN_PASSWORD не задан");
    return NextResponse.json({ ok: true });
  }

  let update: TelegramUpdate;
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const message = update.message;
  if (!message?.chat?.id) return NextResponse.json({ ok: true });

  const chatId = message.chat.id;
  const text = (message.text ?? "").trim();
  const supabase = createAdminClient();
  const now = new Date();

  const { data: session } = await supabase
    .from("admin_sessions")
    .select("*")
    .eq("chat_id", chatId)
    .maybeSingle();

  if (session?.locked_until && new Date(session.locked_until) > now) {
    const minutesLeft = Math.ceil((new Date(session.locked_until).getTime() - now.getTime()) / 60000);
    await sendTelegramMessage(chatId, `🔒 Слишком много неверных попыток. Попробуйте через ${minutesLeft} мин.`);
    return NextResponse.json({ ok: true });
  }

  if (text.startsWith("/login")) {
    const attempt = text.replace("/login", "").trim();

    if (attempt === adminPassword) {
      const authorizedUntil = new Date(now.getTime() + SESSION_HOURS * 60 * 60 * 1000);
      await supabase.from("admin_sessions").upsert({
        chat_id: chatId,
        authorized_until: authorizedUntil.toISOString(),
        failed_attempts: 0,
        locked_until: null,
        updated_at: now.toISOString(),
      });
      await sendTelegramMessage(chatId, "✅ Вы авторизованы. Уведомления о заказах будут приходить сюда 24 часа.");
    } else {
      const failedAttempts = (session?.failed_attempts ?? 0) + 1;
      const lockNow = failedAttempts >= MAX_ATTEMPTS;
      await supabase.from("admin_sessions").upsert({
        chat_id: chatId,
        authorized_until: session?.authorized_until ?? null,
        failed_attempts: lockNow ? 0 : failedAttempts,
        locked_until: lockNow
          ? new Date(now.getTime() + LOCKOUT_MINUTES * 60 * 1000).toISOString()
          : null,
        updated_at: now.toISOString(),
      });
      if (lockNow) {
        await sendTelegramMessage(chatId, `🔒 Превышен лимит попыток. Блок на ${LOCKOUT_MINUTES} мин.`);
      } else {
        await sendTelegramMessage(chatId, `❌ Неверный пароль. Осталось попыток: ${MAX_ATTEMPTS - failedAttempts}.`);
      }
    }
    return NextResponse.json({ ok: true });
  }

  const isAuthorized = session?.authorized_until && new Date(session.authorized_until) > now;
  if (!isAuthorized) {
    await sendTelegramMessage(chatId, "Доступ закрыт. Введите пароль: /login <пароль>");
  } else {
    await sendTelegramMessage(chatId, "Вы авторизованы. Уведомления о заказах приходят автоматически.");
  }
  return NextResponse.json({ ok: true });
}
