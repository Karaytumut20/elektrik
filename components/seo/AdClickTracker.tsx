"use client";

import { useEffect } from "react";

const clickTypes = ["gclid", "gbraid", "wbraid"] as const;

export function AdClickTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clickType = clickTypes.find((type) => params.has(type));
    if (!clickType) return;
    const clickId = params.get(clickType)?.trim();
    if (!clickId || clickId.length < 6 || clickId.length > 512 || !/^[A-Za-z0-9._~-]+$/.test(clickId)) return;

    const sessionKey = `ad-click-recorded:${clickType}:${clickId}`;
    if (sessionStorage.getItem(sessionKey)) return;

    void fetch("/api/ad-clicks", {
      method: "POST",
      credentials: "same-origin",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clickType,
        clickId,
        landingPage: `${window.location.pathname}${window.location.search}`.slice(0, 2048),
        pageReferrer: document.referrer.slice(0, 2048),
      }),
    }).then((response) => {
      if (response.ok) sessionStorage.setItem(sessionKey, "1");
    }).catch(() => undefined);
  }, []);

  return null;
}
