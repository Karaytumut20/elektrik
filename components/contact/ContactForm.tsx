"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { sendContactRequest } from "@/app/iletisim/actions";
import { services } from "@/data/services";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full sm:w-auto">
      {pending ? "Gönderiliyor..." : "Talep gönder"}
    </button>
  );
}

export function ContactForm() {
  const [state, action] = useActionState(sendContactRequest, {});

  return (
    <form action={action} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      {/* Honeypot field for spam prevention */}
      <div className="absolute -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <input 
          type="text" 
          name="bot_trap_field" 
          tabIndex={-1} 
          autoComplete="new-password" 
          style={{ display: "none" }} 
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="name" className="form-label">
          Ad soyad
        </label>
        <input id="name" name="name" required minLength={3} className="field" autoComplete="name" />
        {state.fieldErrors?.name ? <p className="form-error">{state.fieldErrors.name}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="phone" className="form-label">
            Telefon
          </label>
          <input id="phone" name="phone" required minLength={10} className="field" autoComplete="tel" inputMode="tel" />
          {state.fieldErrors?.phone ? <p className="form-error">{state.fieldErrors.phone}</p> : null}
        </div>
        <div className="grid gap-2">
          <label htmlFor="email" className="form-label">
            E-posta
          </label>
          <input id="email" name="email" type="email" className="field" autoComplete="email" />
          {state.fieldErrors?.email ? <p className="form-error">{state.fieldErrors.email}</p> : null}
        </div>
      </div>
      <div className="grid gap-2">
        <label htmlFor="service" className="form-label">
          Hizmet seçimi
        </label>
        <select id="service" name="service" required className="field" defaultValue="">
          <option value="" disabled>
            Hizmet seçin
          </option>
          {services.map((service) => (
            <option key={service.slug} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
        {state.fieldErrors?.service ? <p className="form-error">{state.fieldErrors.service}</p> : null}
      </div>
      <div className="grid gap-2">
        <label htmlFor="message" className="form-label">
          Mesaj
        </label>
        <textarea id="message" name="message" required minLength={10} rows={5} className="field" />
        {state.fieldErrors?.message ? <p className="form-error">{state.fieldErrors.message}</p> : null}
      </div>
      <label className="flex gap-3 text-sm leading-6 text-slate-700">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4" />
        KVKK aydınlatma metnini okudum; tarafıma dönüş yapılması için bilgilerimin işlenmesini kabul ediyorum.
      </label>
      {state.fieldErrors?.consent ? <p className="form-error">{state.fieldErrors.consent}</p> : null}
      {state.message ? (
        <p className={`rounded-md p-3 text-sm font-semibold ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>
          {state.message}
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
