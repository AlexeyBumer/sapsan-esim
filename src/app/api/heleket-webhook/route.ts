import { NextResponse } from "next/server";
import { verifyWebhook } from "@/lib/heleket";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyAuthorizedAdmins } from "@/lib/telegram";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const raw = await req.text();

  if (!verifyWebhook(raw)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: true });
  }

  const status = data.status as string | undefined;
  const orderId = data.order_id as string | undefined;

  if ((status === "paid" || status === "paid_over") && orderId) {
    const admin = createAdminClient();

    const { data: existingOrder } = await admin
      .from("orders")
      .select("id, package_gb, mode, payer_email, user_id, payment_status")
      .eq("heleket_order_id", orderId)
      .maybeSingle();

    if (existingOrder && existingOrder.payment_status !== "paid") {
      await admin
        .from("orders")
        .update({
          payment_status: "paid",
          heleket_uuid: (data.uuid as string) ?? null,
          paid_at: new Date().toISOString(),
        })
        .eq("id", existingOrder.id);
    }

    let gb = existingOrder?.package_gb as number | undefined;
    let mode = existingOrder?.mode as string | undefined;
    let email = existingOrder?.payer_email as string | undefined;

    if (!existingOrder) {
      try {
        const additional = JSON.parse((data.additional_data as string) ?? "{}");
        gb = additional.gb;
        mode = additional.mode;
        email = additional.email ?? additional.esimId ?? undefined;
      } catch {}
    }

    const amountUsd = data.payment_amount_usd ?? data.amount ?? "—";

    await notifyAuthorizedAdmins(
      `💸 <b>Оплаченный заказ</b>\n` +
        `Order ID: <code>${orderId}</code>\n` +
        `Тип: ${mode === "topup" ? "пополнение" : "новая eSIM"}\n` +
        `Пакет: ${gb ?? "—"} ГБ\n` +
        `Сумма: $${amountUsd}\n` +
        `${email ? `Контакт: ${email}\n` : ""}` +
        `${existingOrder ? "Аккаунт привязан\n" : "Гостевой заказ (без аккаунта)\n"}` +
        `\nВыдайте eSIM и впишите ID в заказ.`
    );

    console.log("[Heleket] Оплачен заказ:", orderId, amountUsd, data.updated_at);
  }

  return NextResponse.json({ ok: true });
}
