"use client";

import { useEffect, useState } from "react";

/**
 * Показывает дату и время оформления оплаты в местном времени пользователя.
 * Рендерится на клиенте, чтобы корректно отображать часовой пояс посетителя.
 */
export default function PaymentMeta() {
  const [stamp, setStamp] = useState("");

  useEffect(() => {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(now);
    setStamp(formatted);
  }, []);

  return (
    <div className="flex justify-between">
      <span className="text-mist/50">Время</span>
      <span className="text-ink">{stamp || "—"}</span>
    </div>
  );
}
