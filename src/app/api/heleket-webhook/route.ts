import { NextResponse } from "next/server";
import { verifyWebhook } from "@/lib/heleket";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyAuthorizedAdmins } from "@/lib/telegram";

export const runtime = "nodejs";

const REFERRAL_REWARD_GB = 5;

type AdminClient = ReturnType<typeof createAdminClient>;

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

    const wasAlreadyPaid = existingOrder?.payment_status === "paid";

    if (existingOrder && !wasAlreadyPaid) {
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

    // Реферальный бонус: +5 ГБ рефереру, но только за ПЕРВУЮ оплаченную
    // покупку приглашённого друга. wasAlreadyPaid защищает от повторного
    // начисления, если Heleket пришлёт этот же вебхук дважды.
    if (existingOrder?.user_id && !wasAlreadyPaid) {
      try {
        await creditReferralBonusIfEligible(admin, existingOrder.user_id);
      } catch (e) {
        console.error("Не удалось начислить реферальный бонус:", e);
      }
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

/**
 * Проверяет, есть ли у пользователя реферер и не была ли уже оплачена
 * покупка этим пользователем ранее — и если это правда первая оплата,
 * начисляет +5 ГБ на referral_gb_balance реферера, атомарно через RPC.
 */
async function creditReferralBonusIfEligible(admin: AdminClient, userId: string) {
  const { data: profile } = await admin
    .from("profiles")
    .select("id, referred_by")
    .eq("id", userId)
    .maybeSingle();

  if (!profile?.referred_by) return;

  const { count: paidCount } = await admin
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("payment_status", "paid");

  // На этот момент текущий заказ уже отмечен paid выше, поэтому при первой
  // оплате paidCount будет ровно 1.
  if ((paidCount ?? 0) > 1) return;

  const { data: logRow } = await admin
    .from("referral_log")
    .select("id, credited")
    .eq("referred_id", userId)
    .maybeSingle();

  if (!logRow || logRow.credited) return;

  await admin
    .from("referral_log")
    .update({ credited: true, credited_at: new Date().toISOString() })
    .eq("id", logRow.id);

  await admin.rpc("increment_referral_gb_balance", {
    p_user_id: profile.referred_by,
    p_amount: REFERRAL_REWARD_GB,
  });
}
