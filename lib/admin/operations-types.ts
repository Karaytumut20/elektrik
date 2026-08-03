export type Currency = "TRY" | "USD";
export type AdminMetric = { label: string; tryValue?: number; usdValue?: number; count?: number };

export type Customer = {
  id: string;
  customer_type: "individual" | "corporate";
  name: string;
  contact_name: string | null;
  primary_phone: string;
  secondary_phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  district: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
};

export type Staff = {
  id: string;
  full_name: string;
  phone: string | null;
  title: string | null;
  work_start: string;
  work_end: string;
};

export type Appointment = {
  id: string;
  customer_id: string;
  service_name: string;
  starts_at: string;
  estimated_ends_at: string;
  priority: "normal" | "important" | "urgent";
  status: string;
  amount_due: number | null;
  currency: Currency;
  primary_staff_id: string | null;
  assistant_staff_id: string | null;
  customer?: { name: string; primary_phone: string } | null;
  primary_staff?: { full_name: string } | null;
};

export type ServiceOrder = {
  id: string;
  order_number: string;
  customer_id: string;
  appointment_id: string | null;
  service_name: string;
  status: string;
  currency: Currency;
  labor_sale: number;
  material_sale_total: number;
  total_cost: number;
  grand_total: number;
  paid_amount: number;
  net_profit: number;
  tax_rate: number;
  exchange_rate: number | null;
  created_at: string;
  finished_at: string | null;
  customer?: { name: string; primary_phone: string } | null;
};

export type InventoryItem = {
  id: string;
  name: string;
  category: string | null;
  brand: string | null;
  model: string | null;
  sku: string | null;
  unit: string;
  stock_quantity: number;
  minimum_stock: number;
  unit_purchase_price: number;
  unit_sale_price: number | null;
  supplier_name: string | null;
  warranty_months: number | null;
  storage_location: string | null;
};

export type ExchangeRate = {
  rate: number;
  rateDate: string;
  source: "TCMB";
  stale: boolean;
};

export function money(value: number | null | undefined, currency: Currency = "TRY") {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));
}

export function dateTime(value: string | Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function appointmentStatusLabel(status: string) {
  return ({
    planned: "Planlandı",
    customer_called: "Müşteri Arandı",
    on_the_way: "Yola Çıkıldı",
    started: "İşlem Başladı",
    waiting_material: "Malzeme Bekleniyor",
    completed: "İşlem Tamamlandı",
    cancelled: "İptal Edildi",
    postponed: "Ertelendi",
    waiting_payment: "Tahsilat Bekleniyor",
  } as Record<string, string>)[status] ?? status;
}

export function orderStatusLabel(status: string) {
  return ({
    draft: "Taslak",
    started: "İşlem Başladı",
    waiting_material: "Malzeme Bekleniyor",
    completed: "Tamamlandı",
    cancelled: "İptal Edildi",
  } as Record<string, string>)[status] ?? status;
}
