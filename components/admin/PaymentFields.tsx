"use client";

import { useState } from "react";
import type { Currency } from "@/lib/admin/operations-types";

export function PaymentFields({ remaining, currency, exchangeRate }: { remaining: number; currency: Currency; exchangeRate: number | null }) {
  const [paymentCurrency, setPaymentCurrency] = useState<Currency>(currency);
  const [amount, setAmount] = useState("");
  const maximum = paymentCurrency === currency
    ? remaining
    : currency === "TRY"
      ? remaining / Number(exchangeRate || 1)
      : remaining * Number(exchangeRate || 1);
  return (
    <>
      <div className="admin-field"><label htmlFor="payment_currency">Para birimi</label><select id="payment_currency" name="currency" value={paymentCurrency} onChange={(event) => setPaymentCurrency(event.target.value as Currency)}><option>TRY</option><option>USD</option></select></div>
      <div className="admin-field"><label htmlFor="payment_amount">Tahsilat tutarı</label><input id="payment_amount" name="amount" type="number" min="0.01" max={maximum.toFixed(2)} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required /><span className="text-xs text-slate-500">Maksimum: {maximum.toFixed(2)} {paymentCurrency}</span></div>
      <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2"><input type="checkbox" onChange={(event) => setAmount(event.target.checked ? maximum.toFixed(2) : "")} /> Kalan tutarın tamamı alındı</label>
    </>
  );
}
