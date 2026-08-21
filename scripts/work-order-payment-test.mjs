import { readFileSync } from "node:fs";
import { join } from "node:path";

const page = readFileSync(join(process.cwd(), "app", "admin", "work-orders", "[id]", "page.tsx"), "utf8");
const paymentCard = page.indexOf("Borç Ödeme / Tahsilat Al");
const navigation = page.indexOf("<nav className=");
const checks = [
  ["payment card is at the top of the work-order detail", paymentCard >= 0 && paymentCard < navigation],
  ["payment card shows remaining balance", /kalan borç: \{money\(remaining, order\.currency\)\}/.test(page)],
  ["payment is recorded from the top card", /submitLabel="Ödemeyi Kaydet"/.test(page) && /action=\{recordPayment\}/.test(page)],
  ["the lower area remains a payment history", /<h2 className="mb-4 text-xl font-bold">Ödeme Geçmişi<\/h2>/.test(page)],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length) {
  console.error(`Work-order payment checks failed:\n${failed.join("\n")}`);
  process.exit(1);
}

console.log("Work-order payment test passed: payment entry is prominent and payment history remains available.");
