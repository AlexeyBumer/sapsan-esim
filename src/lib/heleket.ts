import crypto from "crypto";

/**
 * Серверный помощник для Heleket.
 * ВАЖНО: используется ТОЛЬКО на сервере (в API-роутах).
 * Ключи берутся из переменных окружения Vercel, НЕ из кода.
 */

const API_URL = "https://api.heleket.com/v1/payment";

function getCredentials() {
  const merchant = process.env.HELEKET_MERCHANT_ID;
  const apiKey = process.env.HELEKET_PAYMENT_API_KEY;
  if (!merchant || !apiKey) {
    throw new Error(
      "Не заданы HELEKET_MERCHANT_ID или HELEKET_PAYMENT_API_KEY в переменных окружения."
    );
  }
  return { merchant, apiKey };
}

/**
 * Подпись запроса по правилам Heleket:
 * sign = md5( base64(JSON-тело) + API_KEY )
 */
export function makeSign(bodyJson: string, apiKey: string): string {
  const base64 = Buffer.from(bodyJson).toString("base64");
  return crypto.createHash("md5").update(base64 + apiKey).digest("hex");
}

export type CreateInvoiceInput = {
  amount: string; // "39.80"
  orderId: string; // уникальный ID заказа
  urlSuccess: string;
  urlReturn: string;
  urlCallback?: string;
  payerEmail?: string;
  additionalData?: string; // служебная инфа (тип заказа, ГБ, eSIM ID)
};

export type HeleketInvoice = {
  uuid: string;
  order_id: string;
  url: string; // ссылка на страницу оплаты
  payment_status: string;
};

/**
 * Создаёт счёт в Heleket и возвращает ссылку на оплату.
 * Цена выставляется в USD, клиент платит криптой (USDT и др.).
 */
export async function createInvoice(
  input: CreateInvoiceInput
): Promise<HeleketInvoice> {
  const { merchant, apiKey } = getCredentials();

  const payload: Record<string, unknown> = {
    amount: input.amount,
    currency: "USD",
    order_id: input.orderId,
    url_success: input.urlSuccess,
    url_return: input.urlReturn,
    lifetime: 3600,
  };
  if (input.urlCallback) payload.url_callback = input.urlCallback;
  if (input.payerEmail) payload.payer_email = input.payerEmail;
  if (input.additionalData) payload.additional_data = input.additionalData;

  const bodyJson = JSON.stringify(payload);
  const sign = makeSign(bodyJson, apiKey);

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      merchant,
      sign,
      "Content-Type": "application/json",
    },
    body: bodyJson,
    cache: "no-store",
  });

  const data = await res.json();

  if (data.state !== 0 || !data.result?.url) {
    const msg = data.message || JSON.stringify(data.errors || data);
    throw new Error(`Heleket: не удалось создать счёт — ${msg}`);
  }

  return {
    uuid: data.result.uuid,
    order_id: data.result.order_id,
    url: data.result.url,
    payment_status: data.result.payment_status,
  };
}

/**
 * Проверка подписи входящего вебхука от Heleket.
 * Heleket присылает поле sign внутри тела; его убирают,
 * остальное тело подписывают тем же способом и сверяют.
 */
export function verifyWebhook(rawBody: string): boolean {
  try {
    const { apiKey } = getCredentials();
    const parsed = JSON.parse(rawBody) as Record<string, unknown>;
    const incomingSign = parsed.sign as string | undefined;
    if (!incomingSign) return false;
    delete parsed.sign;
    const bodyJson = JSON.stringify(parsed);
    const expected = makeSign(bodyJson, apiKey);
    return expected === incomingSign;
  } catch {
    return false;
  }
}
