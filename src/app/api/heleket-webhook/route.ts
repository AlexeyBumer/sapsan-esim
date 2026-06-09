import { NextResponse } from "next/server";
import { verifyWebhook } from "@/lib/heleket";

export const runtime = "nodejs";

/**
 * POST /api/heleket-webhook
 * Heleket присылает сюда статус оплаты. Мы проверяем подпись.
 *
 * На простой схеме (без базы) мы просто фиксируем факт оплаты в логах Vercel.
 * Когда подключите базу/Telegram-бота — здесь можно автоматически
 * уведомлять оператора об оплаченном заказе.
 */
export async function POST(req: Request) {
  const raw = await req.text();

  if (!verifyWebhook(raw)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    const data = JSON.parse(raw);
    // Статусы: paid, paid_over — успешная оплата
    if (data.status === "paid" || data.status === "paid_over") {
      // Заказ оплачен. order_id — это ID eSIM, additional_data — детали заказа.
      console.log("[Heleket] Оплачен заказ:", data.order_id, data.additional_data);
      // TODO (опционально): отправить оператору уведомление через Telegram Bot API
    }
  } catch {
    // тело не распарсилось — игнорируем
  }

  // Heleket ждёт 200 OK
  return NextResponse.json({ ok: true });
}
