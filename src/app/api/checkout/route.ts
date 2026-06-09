import { NextResponse } from "next/server";
import { createInvoice } from "@/lib/heleket";
import { PRICE_PER_GB, ESIM_SETUP_PRICE } from "@/lib/content";

export const runtime = "nodejs";

/**
 * POST /api/checkout
 * Принимает заказ из формы, создаёт счёт в Heleket, возвращает ссылку на оплату.
 * Тело: { mode: "new" | "topup", email?, esimId?, gb: number }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mode: "new" | "topup" = body.mode === "topup" ? "topup" : "new";
    const gb = Number(body.gb);
    const email: string | undefined = body.email?.trim() || undefined;
    const esimId: string | undefined = body.esimId?.trim() || undefined;

    // Валидация
    if (!gb || gb < 1 || gb > 500) {
      return NextResponse.json(
        { error: "Укажите количество ГБ (от 1 до 500)." },
        { status: 400 }
      );
    }
    if (mode === "new" && !email) {
      return NextResponse.json(
        { error: "Для новой eSIM нужен email." },
        { status: 400 }
      );
    }
    if (mode === "topup" && !esimId) {
      return NextResponse.json(
        { error: "Для пополнения укажите ID вашей eSIM." },
        { status: 400 }
      );
    }

    // Расчёт суммы
    const trafficCost = gb * PRICE_PER_GB;
    const setup = mode === "new" ? ESIM_SETUP_PRICE : 0;
    const amount = (trafficCost + setup).toFixed(2);

    // Уникальный ID заказа. Для новой eSIM он же станет ID, который сообщат оператору.
    const prefix = mode === "new" ? "SAP" : "TOP";
    const orderId = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    // Базовый URL сайта
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    const additional = JSON.stringify({
      mode,
      gb,
      email: email || null,
      esimId: esimId || null,
    }).slice(0, 255);

    const invoice = await createInvoice({
      amount,
      orderId,
      urlSuccess: `${origin}/success?id=${encodeURIComponent(orderId)}&mode=${mode}&gb=${gb}`,
      urlReturn: `${origin}/order`,
      urlCallback: `${origin}/api/heleket-webhook`,
      payerEmail: email,
      additionalData: additional,
    });

    return NextResponse.json({ url: invoice.url, orderId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Неизвестная ошибка";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
