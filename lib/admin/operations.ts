import { unstable_cache } from "next/cache";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import type { Appointment, Customer, ExchangeRate, InventoryItem, ServiceOrder, Staff } from "./operations-types";

type QueryResult<T> = { data: T; error?: string };

function failure<T>(fallback: T, error: unknown): QueryResult<T> {
  return { data: fallback, error: error instanceof Error ? error.message : "Veri alınamadı." };
}

export async function getCustomers(search = ""): Promise<QueryResult<Customer[]>> {
  try {
    const db = createSupabaseServiceClient();
    let query = db.from("customers").select("*").is("deleted_at", null).order("name").limit(250);
    if (search.trim()) query = query.or(`name.ilike.%${search.trim()}%,primary_phone.ilike.%${search.trim()}%`);
    const { data, error } = await query;
    if (error) throw error;
    return { data: (data ?? []) as Customer[] };
  } catch (error) {
    return failure([], error);
  }
}

export async function getStaff(): Promise<QueryResult<Staff[]>> {
  try {
    const { data, error } = await createSupabaseServiceClient()
      .from("staff").select("*").is("deleted_at", null).eq("is_active", true).order("full_name");
    if (error) throw error;
    return { data: (data ?? []) as Staff[] };
  } catch (error) {
    return failure([], error);
  }
}

export async function getAppointments(from: string, to: string): Promise<QueryResult<Appointment[]>> {
  try {
    const { data, error } = await createSupabaseServiceClient()
      .from("appointments")
      .select("*, customer:customers(name,primary_phone), primary_staff:staff!appointments_primary_staff_id_fkey(full_name)")
      .is("deleted_at", null).gte("starts_at", from).lt("starts_at", to).order("starts_at").limit(500);
    if (error) throw error;
    return { data: (data ?? []) as unknown as Appointment[] };
  } catch (error) {
    return failure([], error);
  }
}

export async function getServiceOrders(search = ""): Promise<QueryResult<ServiceOrder[]>> {
  try {
    const db = createSupabaseServiceClient();
    let query = db.from("service_orders")
      .select("*, customer:customers(name,primary_phone)")
      .is("deleted_at", null).order("created_at", { ascending: false }).limit(250);
    if (search.trim()) query = query.or(`order_number.ilike.%${search.trim()}%,service_name.ilike.%${search.trim()}%`);
    const { data, error } = await query;
    if (error) throw error;
    return { data: (data ?? []) as unknown as ServiceOrder[] };
  } catch (error) {
    return failure([], error);
  }
}

export async function getServiceOrder(id: string) {
  try {
    const db = createSupabaseServiceClient();
    const [orderResult, materialsResult, paymentsResult, filesResult, auditResult] = await Promise.all([
      db.from("service_orders").select("*, customer:customers(*)").eq("id", id).is("deleted_at", null).single(),
      db.from("service_order_materials").select("*").eq("service_order_id", id).is("deleted_at", null).order("created_at"),
      db.from("payments").select("*, collector:staff(full_name)").eq("service_order_id", id).is("voided_at", null).order("paid_at", { ascending: false }),
      db.from("service_order_files").select("*").eq("service_order_id", id).is("deleted_at", null).order("created_at", { ascending: false }),
      db.from("audit_logs").select("*").eq("target_id", id).order("created_at", { ascending: false }).limit(100),
    ]);
    if (orderResult.error) throw orderResult.error;
    return {
      data: {
        order: orderResult.data as unknown as ServiceOrder & { customer: Customer },
        materials: materialsResult.data ?? [],
        payments: paymentsResult.data ?? [],
        files: filesResult.data ?? [],
        audit: auditResult.data ?? [],
      },
    };
  } catch (error) {
    return failure(null, error);
  }
}

export async function getInventory(): Promise<QueryResult<InventoryItem[]>> {
  try {
    const { data, error } = await createSupabaseServiceClient()
      .from("inventory_items").select("*").is("deleted_at", null).eq("is_active", true).order("name").limit(500);
    if (error) throw error;
    return { data: (data ?? []) as InventoryItem[] };
  } catch (error) {
    return failure([], error);
  }
}

export async function getCustomerProfile(id: string) {
  try {
    const db = createSupabaseServiceClient();
    const [customer, appointments, orders, payments, materials, notes] = await Promise.all([
      db.from("customers").select("*").eq("id", id).is("deleted_at", null).single(),
      db.from("appointments").select("*").eq("customer_id", id).is("deleted_at", null).order("starts_at", { ascending: false }),
      db.from("service_orders").select("*").eq("customer_id", id).is("deleted_at", null).order("created_at", { ascending: false }),
      db.from("payments").select("*").eq("customer_id", id).is("voided_at", null).order("paid_at", { ascending: false }),
      db.from("service_order_materials").select("*, service_order:service_orders!inner(order_number,customer_id)").eq("service_order.customer_id", id).is("deleted_at", null),
      db.from("customer_notes").select("*").eq("customer_id", id).is("deleted_at", null).order("created_at", { ascending: false }),
    ]);
    if (customer.error) throw customer.error;
    return { data: { customer: customer.data as Customer, appointments: appointments.data ?? [], orders: orders.data ?? [], payments: payments.data ?? [], materials: materials.data ?? [], notes: notes.data ?? [] } };
  } catch (error) {
    return failure(null, error);
  }
}

type DashboardData = {
  todayAppointments: number;
  tomorrowAppointments: number;
  activeOrders: number;
  waitingPayment: number;
  customers: number;
  lowStock: number;
  weeklyFinished: number;
  receivableTRY: number;
  receivableUSD: number;
};

export async function getDashboardData(): Promise<QueryResult<DashboardData | null>> {
  try {
    const db = createSupabaseServiceClient();
    const now = new Date();
    const istanbulDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(now);
    const todayStart = new Date(`${istanbulDay}T00:00:00+03:00`);
    const tomorrowStart = new Date(todayStart.getTime() + 86400000);
    const nextDay = new Date(todayStart.getTime() + 172800000);
    const [today, tomorrow, orders, customers, inventory] = await Promise.all([
      db.from("appointments").select("id", { count: "exact", head: true }).is("deleted_at", null).gte("starts_at", todayStart.toISOString()).lt("starts_at", tomorrowStart.toISOString()),
      db.from("appointments").select("id", { count: "exact", head: true }).is("deleted_at", null).gte("starts_at", tomorrowStart.toISOString()).lt("starts_at", nextDay.toISOString()),
      db.from("service_orders").select("status,currency,grand_total,paid_amount,finished_at").is("deleted_at", null),
      db.from("customers").select("id", { count: "exact", head: true }).is("deleted_at", null),
      db.from("inventory_items").select("stock_quantity,minimum_stock").is("deleted_at", null).eq("is_active", true),
    ]);
    const orderRows = (orders.data ?? []) as Pick<ServiceOrder, "status" | "currency" | "grand_total" | "paid_amount" | "finished_at">[];
    const weekDay = (todayStart.getDay() + 6) % 7;
    const weekStart = new Date(todayStart.getTime() - weekDay * 86400000);
    const weekEnd = new Date(weekStart.getTime() + 7 * 86400000);
    return {
      data: {
        todayAppointments: today.count ?? 0,
        tomorrowAppointments: tomorrow.count ?? 0,
        activeOrders: orderRows.filter((o) => !["completed", "cancelled"].includes(o.status)).length,
        waitingPayment: orderRows.filter((o) => o.status !== "cancelled" && Number(o.grand_total) - Number(o.paid_amount) > 0.01).length,
        customers: customers.count ?? 0,
        lowStock: (inventory.data ?? []).filter((item) => Number(item.stock_quantity) <= Number(item.minimum_stock)).length,
        weeklyFinished: orderRows.filter((o) => o.status === "completed" && o.finished_at && new Date(o.finished_at) >= weekStart && new Date(o.finished_at) < weekEnd).length,
        receivableTRY: orderRows.filter((o) => o.currency === "TRY" && o.status !== "cancelled").reduce((sum, o) => sum + Math.max(0, Number(o.grand_total) - Number(o.paid_amount)), 0),
        receivableUSD: orderRows.filter((o) => o.currency === "USD" && o.status !== "cancelled").reduce((sum, o) => sum + Math.max(0, Number(o.grand_total) - Number(o.paid_amount)), 0),
      },
    };
  } catch (error) {
    return failure(null, error);
  }
}

async function fetchTcmbRateUncached(): Promise<ExchangeRate> {
  const db = createSupabaseServiceClient();
  try {
    const response = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml", {
      next: { revalidate: 14400 },
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) throw new Error("TCMB kuru alınamadı.");
    const xml = await response.text();
    const block = xml.match(/<Currency[^>]+CurrencyCode="USD"[\s\S]*?<\/Currency>/)?.[0];
    const raw = block?.match(/<ForexSelling>([^<]+)<\/ForexSelling>/)?.[1];
    const dateRaw = xml.match(/Date="(\d{2}\/\d{2}\/\d{4})"/)?.[1];
    if (!raw || !dateRaw) throw new Error("TCMB kur verisi çözümlenemedi.");
    const [day, month, year] = dateRaw.split("/");
    const result: ExchangeRate = { rate: Number(raw), rateDate: `${year}-${month}-${day}`, source: "TCMB", stale: false };
    await db.from("exchange_rates").upsert({ rate_date: result.rateDate, rate: result.rate, source: "TCMB" });
    return result;
  } catch {
    const { data } = await db.from("exchange_rates").select("rate,rate_date").order("rate_date", { ascending: false }).limit(1).maybeSingle();
    if (!data) throw new Error("Güncel veya kayıtlı döviz kuru bulunamadı.");
    return { rate: Number(data.rate), rateDate: data.rate_date, source: "TCMB", stale: true };
  }
}

export const getTcmbRate = unstable_cache(fetchTcmbRateUncached, ["tcmb-usd-try"], { revalidate: 14400 });
