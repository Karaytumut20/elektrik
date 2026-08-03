"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return <button type="button" className="btn btn-secondary print:hidden" onClick={() => window.print()}><Printer className="h-4 w-4" /> Yazdır / PDF</button>;
}
