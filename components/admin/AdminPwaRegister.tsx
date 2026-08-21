"use client";

import { useEffect } from "react";

/** Registers the root worker while an admin page is open so the admin manifest
 * is installable. The worker intentionally never caches private admin routes. */
export function AdminPwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const register = () => { void navigator.serviceWorker.register("/sw.js"); };
    window.addEventListener("load", register, { once: true });
    if (document.readyState === "complete") register();
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
