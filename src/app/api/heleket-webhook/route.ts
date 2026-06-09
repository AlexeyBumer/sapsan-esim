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
      // Заказ оплачен. order_id — ID eSIM, additional_data — детали заказа.
      // Здесь же доступны точные данные от Heleket:
      //   data.payment_amount_usd — фактически оплаченная сумма в USD
      //   data.updated_at — точное время подтверждения транзакции (UTC+3)
      // Их можно сохранять в БД и показывать клиенту/оператору при автоматизации.
      console.log("[Heleket] Оплачен заказ:", data.order_id, data.payment_amount_usd, data.updated_at);
      // TODO (опционально): уведомить оператора через Telegram Bot API
    }
  } catch {
    // тело не распарсилось — игнорируем
  }

  // Heleket ждёт 200 OK
  return NextResponse.json({ ok: true });
}
