"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { signInAdmin } from "@/app/admin/login/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full">
      {pending ? "Giris yapiliyor..." : "Giris yap"}
    </button>
  );
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const [state, action] = useActionState(signInAdmin, {});

  return (
    <form action={action} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="next" value={searchParams.get("next") ?? "/admin/blog"} />
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-semibold text-slate-800">
          E-posta
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className="field" />
      </div>
      <div className="grid gap-2">
        <label htmlFor="password" className="text-sm font-semibold text-slate-800">
          Sifre
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      {state.error ? <p className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-700">{state.error}</p> : null}
      <SubmitButton />
    </form>
  );
}
