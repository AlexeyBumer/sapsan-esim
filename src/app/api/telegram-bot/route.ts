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
      await sendTelegramMessage(
        chatId,
        "✅ Вы авторизованы на 24 часа.\n\nКоманды:\n/issue <order_id> <esim_id> — выдать ID/QR eSIM по заказу"
      );
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
    return NextResponse.json({ ok: true });
  }

  if (text.startsWith("/issue")) {
    await handleIssueCommand(supabase, chatId, text);
    return NextResponse.json({ ok: true });
  }

  await sendTelegramMessage(
    chatId,
    "Вы авторизованы. Уведомления о заказах приходят автоматически.\n\nКоманды:\n/issue <order_id> <esim_id> — выдать ID/QR eSIM по заказу"
  );
  return NextResponse.json({ ok: true });
}

/**
 * /issue <order_id> <esim_id>
 * Вписывает выданный ID/QR eSIM прямо в заказ — без захода в Supabase Table Editor.
 * order_id — это heleket_order_id заказа (он же был в уведомлении об оплате).
 */
async function handleIssueCommand(
  supabase: ReturnType<typeof createAdminClient>,
  chatId: number,
  text: string
) {
  const parts = text.split(/\s+/).filter(Boolean);
  // parts[0] = "/issue", parts[1] = order_id, parts[2] = esim_id
  const orderId = parts[1];
  const esimId = parts[2];

  if (!orderId || !esimId) {
    await sendTelegramMessage(
      chatId,
      "Формат команды:\n/issue <order_id> <esim_id>\n\nНапример:\n/issue SAP-1719999999-1234 89701234567890123456"
    );
    return;
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, heleket_order_id, package_gb, mode, payer_email, payment_status, esim_id")
    .eq("heleket_order_id", orderId)
    .maybeSingle();

  if (!order) {
    await sendTelegramMessage(chatId, `❌ Заказ с ID "${orderId}" не найден.`);
    return;
  }

  if (order.payment_status !== "paid") {
    await sendTelegramMessage(
      chatId,
      `⚠️ Заказ "${orderId}" пока не отмечен как оплаченный (статус: ${order.payment_status}). Выдать eSIM всё равно?\nЕсли да — повторите команду ещё раз, она применится.`
    );
    // Не блокируем жёстко — оператор может видеть оплату напрямую в Heleket
    // раньше, чем дойдёт вебхук. Продолжаем выдачу.
  }

  const alreadyIssued = !!order.esim_id;

  await supabase.from("orders").update({ esim_id: esimId }).eq("id", order.id);

  await sendTelegramMessage(
    chatId,
    `✅ ${alreadyIssued ? "eSIM ID обновлён" : "eSIM выдан"} по заказу ${orderId}\n` +
      `Пакет: ${order.package_gb} ГБ (${order.mode === "topup" ? "пополнение" : "новая eSIM"})\n` +
      `${order.payer_email ? `Email: ${order.payer_email}\n` : ""}` +
      `eSIM ID: ${esimId}`
  );
}
