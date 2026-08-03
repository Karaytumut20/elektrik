"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";
import type { OperationState } from "@/lib/admin/operations-actions";

type Action = (state: OperationState, formData: FormData) => Promise<OperationState>;

function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? "Kaydediliyor…" : children}
    </button>
  );
}

export function OperationForm({
  action,
  children,
  submitLabel = "Kaydet",
  className = "space-y-4",
  targetSelectId,
  createdLabelField = "name",
}: {
  action: Action;
  children: ReactNode;
  submitLabel?: string;
  className?: string;
  targetSelectId?: string;
  createdLabelField?: string;
}) {
  const [state, formAction] = useActionState(action, {});
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!state.createdId || !targetSelectId) return;
    const select = document.getElementById(targetSelectId) as HTMLSelectElement | null;
    const labelInput = formRef.current?.elements.namedItem(createdLabelField) as HTMLInputElement | null;
    if (!select) return;
    if (!Array.from(select.options).some((option) => option.value === state.createdId)) {
      select.add(new Option(labelInput?.value || "Yeni kayıt", state.createdId));
    }
    select.value = state.createdId;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }, [createdLabelField, state.createdId, targetSelectId]);
  return (
    <form ref={formRef} action={formAction} className={className}>
      {children}
      {state.error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{state.error}</p> : null}
      {state.ok ? <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{state.message}</p> : null}
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
