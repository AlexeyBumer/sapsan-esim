"use client";

import { useState } from "react";

export default function CopyId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // буфер недоступен — игнорируем
    }
  }

  return (
    <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-abyss/40 px-4 py-3">
      <code className="break-all font-mono text-base text-peach">{id}</code>
      <button
        onClick={copy}
        className="flex-none rounded-lg border border-peach/30 px-3 py-1.5 font-mono text-xs text-peach transition-colors hover:bg-peach/10"
      >
        {copied ? "Скопировано" : "Копировать"}
      </button>
    </div>
  );
}
