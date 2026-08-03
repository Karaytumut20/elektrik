"use client";

import { useState } from "react";

export function CopyIpButton({ ip }: { ip: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold hover:bg-slate-50"
      onClick={async () => {
        await navigator.clipboard.writeText(ip);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? "Kopyalandı" : "IP kopyala"}
    </button>
  );
}
