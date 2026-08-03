"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInClickLogs } from "@/app/admin/click-logs/actions";

function Submit() {
  const { pending } = useFormStatus();
  return <button type="submit" className="btn btn-primary w-full" disabled={pending}>{pending ? "Kontrol ediliyor…" : "Giriş yap"}</button>;
}

export function ClickLogLoginForm() {
  const [state, action] = useActionState(signInClickLogs, {});
  return (
    <form action={action} className="admin-card grid gap-4">
      <div className="admin-field"><label htmlFor="click-log-username">Kullanıcı adı</label><input id="click-log-username" name="username" autoComplete="username" required /></div>
      <div className="admin-field"><label htmlFor="click-log-password">Parola</label><input id="click-log-password" name="password" type="password" autoComplete="current-password" required /></div>
      {state.error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{state.error}</p> : null}
      <Submit />
    </form>
  );
}
