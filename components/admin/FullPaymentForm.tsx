"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { recordPayment } from "@/lib/admin/operations-actions";
import type { Currency } from "@/lib/admin/operations-types";

function Button() {
  const { pending } = useFormStatus();
  return <button type="submit" className="text-sm font-semibold text-emerald-700" disabled={pending}>{pending ? "İşleniyor…" : "Tamamını tahsil et"}</button>;
}

export function FullPaymentForm({ customerId, orderId, amount, currency, exchangeRate, rateDate }: { customerId: string; orderId: string; amount: number; currency: Currency; exchangeRate: number | null; rateDate?: string | null }) {
  const [state, action] = useActionState(recordPayment, {});
  const [key] = useState(() => crypto.randomUUID());
  function confirmSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!window.confirm(`${amount.toFixed(2)} ${currency} tutarında tahsilat kaydı oluşturulsun mu?`)) event.preventDefault();
  }
  return (
    <form action={action} onSubmit={confirmSubmit}>
      <input type="hidden" name="customer_id" value={customerId} />
      <input type="hidden" name="service_order_id" value={orderId} />
      <input type="hidden" name="paid_at" value={new Date().toISOString()} />
      <input type="hidden" name="amount" value={amount.toFixed(2)} />
      <input type="hidden" name="currency" value={currency} />
      <input type="hidden" name="method" value="cash" />
      <input type="hidden" name="description" value="Muhasebe ekranından kalan tutarın tamamı tahsil edildi." />
      <input type="hidden" name="exchange_rate" value={exchangeRate ?? ""} />
      <input type="hidden" name="exchange_rate_date" value={rateDate ?? ""} />
      <input type="hidden" name="idempotency_key" value={key} />
      <Button />
      {state.error ? <span className="ml-2 text-xs text-red-600">{state.error}</span> : null}
    </form>
  );
}
