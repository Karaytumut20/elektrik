"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/admin/auth";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";

export type OperationState = {
  ok?: boolean;
  message?: string;
  error?: string;
  createdId?: string;
  selectedName?: string;
  selectedPhone?: string;
};

const text = (value: FormDataEntryValue | null) => typeof value === "string" ? value.trim() : "";
const optional = (value: FormDataEntryValue | null) => text(value) || null;
const numberOrZero = (value: FormDataEntryValue | null) => {
  const normalized = text(value).replace(",", ".");
  return normalized ? Number(normalized) : 0;
};
const optionalNumber = (value: FormDataEntryValue | null) => {
  const normalized = text(value).replace(",", ".");
  return normalized ? Number(normalized) : null;
};
const normalizedPhone = (value: string) => value.replace(/\D/g, "");

/** `datetime-local` values do not include a timezone. Treat them as Istanbul time
 * consistently, regardless of the server's own timezone. */
function parseAppointmentDate(value: string) {
  if (!value) return null;
  const date = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(value)
    ? new Date(`${value}${value.length === 16 ? ":00" : ""}+03:00`)
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function appointmentRange(startsAt: string, endsAt: string) {
  const start = parseAppointmentDate(startsAt);
  const end = parseAppointmentDate(endsAt);
  if (!start) return { error: "Randevu başlangıç tarihi geçersiz." };
  if (!end) return { error: "Randevu bitiş tarihi geçersiz." };
  if (end.getTime() <= start.getTime()) {
    return { error: "Randevu bitişi başlangıç saatinden sonra olmalıdır." };
  }
  return { start, end };
}

function errorMessage(error: unknown) {
  const candidate = error as { message?: string };
  return candidate?.message || "İşlem tamamlanamadı.";
}

async function audit(actorId: string, action: string, targetTable: string, targetId: string, values: Record<string, unknown>) {
  await createSupabaseServiceClient().from("audit_logs").insert({
    actor_id: actorId,
    action,
    target_table: targetTable,
    target_id: targetId,
    new_values: values,
  });
}

async function findActiveCustomerByPhone(phone: string) {
  const { data, error } = await createSupabaseServiceClient()
    .from("customers")
    .select("id,name,primary_phone")
    .is("deleted_at", null)
    .limit(1000);
  if (error) throw error;
  return (data ?? []).find((customer) => normalizedPhone(customer.primary_phone) === phone) ?? null;
}

function isActiveCustomerPhoneDuplicate(error: unknown) {
  const candidate = error as { code?: string; constraint?: string };
  return candidate?.code === "23505" && candidate.constraint === "customers_primary_phone_active_uidx";
}

export async function createCustomer(_: OperationState, formData: FormData): Promise<OperationState> {
  const admin = await requireRole(["super_admin", "manager", "editor", "support", "service_staff"]);
  const schema = z.object({
    name: z.string().min(2, "Müşteri adı gereklidir."),
    primary_phone: z.string().min(7, "Geçerli telefon girin."),
    customer_type: z.enum(["individual", "corporate"]),
    email: z.string().email("E-posta geçersiz.").nullable().or(z.literal(null)),
  });
  const parsed = schema.safeParse({
    name: text(formData.get("name")),
    primary_phone: text(formData.get("primary_phone")),
    customer_type: text(formData.get("customer_type")) || "individual",
    email: optional(formData.get("email")),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  try {
    const db = createSupabaseServiceClient();
    const phone = normalizedPhone(parsed.data.primary_phone);
    const duplicate = await findActiveCustomerByPhone(phone);
    if (duplicate) {
      return {
        ok: true,
        message: `${duplicate.name} bu telefonla zaten kayıtlı; mevcut müşteri seçildi.`,
        createdId: duplicate.id,
        selectedName: duplicate.name,
        selectedPhone: duplicate.primary_phone,
      };
    }
    const { data, error } = await db.from("customers").insert({
      ...parsed.data,
      contact_name: optional(formData.get("contact_name")),
      secondary_phone: optional(formData.get("secondary_phone")),
      tax_number: optional(formData.get("tax_number")),
      tax_office: optional(formData.get("tax_office")),
      address: optional(formData.get("address")),
      city: optional(formData.get("city")) ?? "Tekirdağ",
      district: optional(formData.get("district")) ?? "Çorlu",
      map_url: optional(formData.get("map_url")),
      notes: optional(formData.get("notes")),
    }).select("id").single();
    if (error) {
      // A concurrent request can still win after the lookup. Resolve the
      // unique-index conflict to the existing customer instead of exposing a database error.
      if (isActiveCustomerPhoneDuplicate(error)) {
        const existing = await findActiveCustomerByPhone(phone);
        if (existing) {
          return {
            ok: true,
            message: `${existing.name} bu telefonla zaten kayıtlı; mevcut müşteri seçildi.`,
            createdId: existing.id,
            selectedName: existing.name,
            selectedPhone: existing.primary_phone,
          };
        }
      }
      throw error;
    }
    await audit(admin.id, "create", "customers", data.id, { name: parsed.data.name, primary_phone: parsed.data.primary_phone });
    revalidatePath("/admin/customers");
    return {
      ok: true,
      message: "Müşteri kaydedildi.",
      createdId: data.id,
      selectedName: parsed.data.name,
      selectedPhone: parsed.data.primary_phone,
    };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function createStaff(_: OperationState, formData: FormData): Promise<OperationState> {
  const admin = await requireRole(["super_admin", "manager", "editor"]);
  const fullName = text(formData.get("full_name"));
  if (fullName.length < 3) return { error: "Personel adı gereklidir." };
  try {
    const { data, error } = await createSupabaseServiceClient().from("staff").insert({
      full_name: fullName,
      phone: optional(formData.get("phone")),
      email: optional(formData.get("email")),
      title: optional(formData.get("title")),
      work_start: text(formData.get("work_start")) || "08:00",
      work_end: text(formData.get("work_end")) || "19:00",
      notes: optional(formData.get("notes")),
    }).select("id").single();
    if (error) throw error;
    await audit(admin.id, "create", "staff", data.id, { full_name: fullName });
    revalidatePath("/admin/calendar");
    return { ok: true, message: "Personel kaydedildi.", createdId: data.id };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function saveAppointment(_: OperationState, formData: FormData): Promise<OperationState> {
  const admin = await requireRole(["super_admin", "manager", "editor", "support", "service_staff"]);
  const schema = z.object({
    customer_id: z.union([z.literal(""), z.string().uuid("Müşteri seçimi geçersiz.")]),
    service_name: z.string().max(160, "İş başlığı en fazla 160 karakter olabilir."),
    starts_at: z.string().max(40),
    estimated_ends_at: z.string().max(40),
    priority: z.enum(["normal", "important", "urgent"]),
    status: z.enum(["planned", "customer_called", "on_the_way", "started", "waiting_material", "completed", "cancelled", "postponed", "waiting_payment"]),
    currency: z.enum(["TRY", "USD"]),
  });
  const parsed = schema.safeParse({
    customer_id: text(formData.get("customer_id")),
    service_name: text(formData.get("service_name")),
    starts_at: text(formData.get("starts_at")),
    estimated_ends_at: text(formData.get("estimated_ends_at")),
    priority: text(formData.get("priority")) || "normal",
    status: text(formData.get("status")) || "planned",
    currency: text(formData.get("currency")) || "TRY",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Randevu alanlarını kontrol edin." };

  const parsedStart = parseAppointmentDate(parsed.data.starts_at);
  const parsedEnd = parseAppointmentDate(parsed.data.estimated_ends_at);
  if (parsed.data.starts_at && !parsedStart) return { error: "Başlangıç tarihi geçersiz." };
  if (parsed.data.estimated_ends_at && !parsedEnd) return { error: "Bitiş tarihi geçersiz." };
  const startsAt = parsedStart ?? (parsedEnd ? new Date(parsedEnd.getTime() - 3600000) : new Date());
  const endsAt = parsedEnd ?? new Date(startsAt.getTime() + 3600000);
  if (!(startsAt < endsAt)) return { error: "Bitiş saati başlangıçtan sonra olmalıdır." };

  const id = optional(formData.get("id"));
  if (id && !z.string().uuid().safeParse(id).success) return { error: "Randevu kaydı geçersiz." };
  const amountDue = optionalNumber(formData.get("amount_due"));
  const exchangeRate = optionalNumber(formData.get("exchange_rate"));
  if (amountDue != null && (!Number.isFinite(amountDue) || amountDue < 0)) return { error: "Tutar geçersiz." };
  if (exchangeRate != null && (!Number.isFinite(exchangeRate) || exchangeRate <= 0)) return { error: "Döviz kuru geçersiz." };
  if (parsed.data.currency === "USD" && parsed.data.customer_id && !exchangeRate) {
    return { error: "USD iş emri için geçerli USD/TL kuru girilmelidir." };
  }
  try {
    const db = createSupabaseServiceClient();
    const payload = {
      customer_id: parsed.data.customer_id || null,
      service_name: parsed.data.service_name || "Yeni iş",
      priority: parsed.data.priority,
      status: parsed.data.status,
      currency: parsed.data.currency,
      starts_at: startsAt.toISOString(),
      estimated_ends_at: endsAt.toISOString(),
      description: optional(formData.get("description")),
      reported_issue: optional(formData.get("reported_issue")),
      service_address: optional(formData.get("service_address")),
      city: optional(formData.get("city")),
      district: optional(formData.get("district")),
      map_url: optional(formData.get("map_url")),
      primary_staff_id: optional(formData.get("primary_staff_id")),
      assistant_staff_id: optional(formData.get("assistant_staff_id")),
      internal_note: optional(formData.get("internal_note")),
      customer_note: optional(formData.get("customer_note")),
      reminder_enabled: formData.get("reminder_enabled") === "on",
      amount_due: amountDue,
      exchange_rate: exchangeRate,
      exchange_rate_date: optional(formData.get("exchange_rate_date")),
      created_by: admin.id,
    };
    const result = id
      ? await db.from("appointments").update(payload).eq("id", id).is("deleted_at", null).select("id").single()
      : await db.from("appointments").insert(payload).select("id").single();
    if (result.error) throw result.error;
    await audit(admin.id, id ? "update" : "create", "appointments", result.data.id, {
      customer_id: parsed.data.customer_id || null, starts_at: startsAt.toISOString(), status: parsed.data.status,
    });
    revalidatePath("/admin/calendar");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/work-orders");
    return {
      ok: true,
      message: id
        ? "Randevu ve bağlantılı iş emri güncellendi."
        : parsed.data.customer_id
          ? "Randevu ve bağlantılı iş emri oluşturuldu."
          : "Randevu oluşturuldu.",
      createdId: result.data.id,
    };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function moveAppointment(id: string, startsAt: string, endsAt: string): Promise<OperationState> {
  const admin = await requireRole(["super_admin", "manager", "editor", "support", "service_staff"]);
  if (!z.string().uuid().safeParse(id).success) return { error: "Randevu kaydı geçersiz." };
  const range = appointmentRange(startsAt, endsAt);
  if ("error" in range) return { error: range.error };
  try {
    const { error } = await createSupabaseServiceClient().from("appointments")
      .update({ starts_at: range.start.toISOString(), estimated_ends_at: range.end.toISOString() })
      .eq("id", id).is("deleted_at", null);
    if (error) throw error;
    await audit(admin.id, "reschedule", "appointments", id, {
      starts_at: range.start.toISOString(), estimated_ends_at: range.end.toISOString(),
    });
    revalidatePath("/admin/calendar");
    return { ok: true };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function createServiceOrder(_: OperationState, formData: FormData): Promise<OperationState> {
  const admin = await requireRole(["super_admin", "manager", "editor", "support", "service_staff"]);
  const customerId = text(formData.get("customer_id"));
  const serviceName = text(formData.get("service_name"));
  if (!z.string().uuid().safeParse(customerId).success || serviceName.length < 2) return { error: "Müşteri ve hizmet adı gereklidir." };
  try {
    const exchangeRate = optionalNumber(formData.get("exchange_rate"));
    const currency = text(formData.get("currency")) === "USD" ? "USD" : "TRY";
    if (currency === "USD" && !exchangeRate) return { error: "USD iş emri için işlem kuru gereklidir." };
    const { data, error } = await createSupabaseServiceClient().from("service_orders").insert({
      customer_id: customerId,
      service_name: serviceName,
      labor_sale: numberOrZero(formData.get("labor_sale")),
      currency,
      status: text(formData.get("status")) || "draft",
      exchange_rate: exchangeRate,
      exchange_rate_date: optional(formData.get("exchange_rate_date")),
      technician_note: optional(formData.get("technician_note")),
      customer_note: optional(formData.get("customer_note")),
      created_by: admin.id,
    }).select("id").single();
    if (error) throw error;
    await createSupabaseServiceClient().rpc("recompute_service_order", { p_service_order_id: data.id });
    await audit(admin.id, "create", "service_orders", data.id, { customer_id: customerId, service_name: serviceName });
    revalidatePath("/admin/work-orders");
    revalidatePath("/admin/dashboard");
    return { ok: true, message: "İş emri oluşturuldu.", createdId: data.id };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function createQuickServiceOrder(_: OperationState, formData: FormData): Promise<OperationState> {
  await requireRole(["super_admin", "manager", "editor", "support", "service_staff"]);
  try {
    const db = await createSupabaseServerClient();
    const appointmentStarts = optional(formData.get("appointment_starts_at"));
    const appointmentEnds = optional(formData.get("appointment_ends_at"));
    if ((appointmentStarts && !appointmentEnds) || (!appointmentStarts && appointmentEnds)) {
      return { error: "İleri tarihli randevu için başlangıç ve bitiş birlikte girilmelidir." };
    }
    const range = appointmentStarts && appointmentEnds ? appointmentRange(appointmentStarts, appointmentEnds) : null;
    if (range && "error" in range) return { error: range.error };
    const customerId = text(formData.get("customer_id"));
    if (!z.string().uuid().safeParse(customerId).success) return { error: "Hızlı işlem için bir müşteri seçmelisiniz." };
    const serviceName = text(formData.get("service_name"));
    if (serviceName.length < 2) return { error: "Hizmet / işlem adı en az 2 karakter olmalıdır." };
    const currency = text(formData.get("currency")) === "USD" ? "USD" : "TRY";
    const exchangeRate = optional(formData.get("exchange_rate"));
    if (currency === "USD" && (!exchangeRate || !Number.isFinite(Number(exchangeRate.replace(",", "."))) || Number(exchangeRate.replace(",", ".")) <= 0)) {
      return { error: "USD işlemi için geçerli USD/TL kuru girilmelidir." };
    }
    const payload = {
      idempotency_key: text(formData.get("idempotency_key")),
      customer_id: customerId,
      service_name: serviceName,
      labor_sale: String(numberOrZero(formData.get("labor_sale"))),
      currency,
      exchange_rate: exchangeRate,
      exchange_rate_date: optional(formData.get("exchange_rate_date")),
      status: text(formData.get("status")) || "draft",
      material_id: optional(formData.get("material_id")),
      material_name: optional(formData.get("material_name")),
      material_quantity: String(numberOrZero(formData.get("material_quantity"))),
      paid: formData.get("paid") === "on",
      payment_method: text(formData.get("payment_method")) || "cash",
      technician_note: optional(formData.get("technician_note")),
      appointment_starts_at: range && "start" in range ? range.start.toISOString() : null,
      appointment_ends_at: range && "end" in range ? range.end.toISOString() : null,
    };
    const { data, error } = await db.rpc("create_quick_service_order", { p_payload: payload });
    if (error) throw error;
    revalidatePath("/admin/work-orders");
    revalidatePath("/admin/calendar");
    revalidatePath("/admin/inventory");
    revalidatePath("/admin/accounting");
    revalidatePath("/admin/dashboard");
    return { ok: true, message: "Hızlı işlem tek transaction içinde tamamlandı.", createdId: String(data) };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function updateServiceOrder(_: OperationState, formData: FormData): Promise<OperationState> {
  const admin = await requireRole(["super_admin", "manager", "editor", "support", "service_staff"]);
  const id = text(formData.get("id"));
  if (!z.string().uuid().safeParse(id).success) return { error: "İş emri bulunamadı." };
  try {
    const financeAllowed = ["super_admin", "manager", "editor"].includes(admin.role);
    if (text(formData.get("status")) === "cancelled" && !financeAllowed) {
      return { error: "İş emri iptali için yönetici yetkisi gereklidir." };
    }
    const payload: Record<string, unknown> = {
      status: text(formData.get("status")),
      labor_hours: numberOrZero(formData.get("labor_hours")),
      technician_note: optional(formData.get("technician_note")),
      customer_note: optional(formData.get("customer_note")),
      finished_at: text(formData.get("status")) === "completed" ? new Date().toISOString() : null,
    };
    if (financeAllowed) Object.assign(payload, {
      labor_cost: numberOrZero(formData.get("labor_cost")),
      labor_sale: numberOrZero(formData.get("labor_sale")),
      transport_cost: numberOrZero(formData.get("transport_cost")),
      extra_staff_cost: numberOrZero(formData.get("extra_staff_cost")),
      other_cost: numberOrZero(formData.get("other_cost")),
      discount: numberOrZero(formData.get("discount")),
      tax_rate: numberOrZero(formData.get("tax_rate")),
    });
    const db = createSupabaseServiceClient();
    const { error } = await db.from("service_orders").update(payload).eq("id", id).is("deleted_at", null);
    if (error) throw error;
    await db.rpc("recompute_service_order", { p_service_order_id: id });
    await audit(admin.id, "update", "service_orders", id, { status: payload.status });
    revalidatePath(`/admin/work-orders/${id}`);
    revalidatePath("/admin/work-orders");
    revalidatePath("/admin/accounting");
    revalidatePath("/admin/dashboard");
    return { ok: true, message: "İş emri güncellendi." };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function createInventoryItem(_: OperationState, formData: FormData): Promise<OperationState> {
  const admin = await requireRole(["super_admin", "manager", "editor"]);
  const name = text(formData.get("name"));
  if (name.length < 2) return { error: "Malzeme adı gereklidir." };
  try {
    const db = createSupabaseServiceClient();
    const initialStock = numberOrZero(formData.get("stock_quantity"));
    const { data, error } = await db.from("inventory_items").insert({
      name,
      category: optional(formData.get("category")),
      brand: optional(formData.get("brand")),
      model: optional(formData.get("model")),
      barcode: optional(formData.get("barcode")),
      sku: optional(formData.get("sku")),
      unit: text(formData.get("unit")) || "adet",
      stock_quantity: initialStock,
      minimum_stock: numberOrZero(formData.get("minimum_stock")),
      unit_purchase_price: numberOrZero(formData.get("unit_purchase_price")),
      unit_sale_price: optionalNumber(formData.get("unit_sale_price")),
      supplier_name: optional(formData.get("supplier_name")),
      purchase_date: optional(formData.get("purchase_date")),
      document_number: optional(formData.get("document_number")),
      warranty_months: optionalNumber(formData.get("warranty_months")),
      storage_location: optional(formData.get("storage_location")),
      description: optional(formData.get("description")),
    }).select("id").single();
    if (error) throw error;
    if (initialStock > 0) await db.from("inventory_movements").insert({
      material_id: data.id, movement_type: "in", quantity: initialStock,
      source_table: "inventory_items", source_id: data.id, description: "İlk stok", created_by: admin.id,
    });
    await audit(admin.id, "create", "inventory_items", data.id, { name, stock_quantity: initialStock });
    revalidatePath("/admin/inventory");
    return { ok: true, message: "Malzeme kaydedildi.", createdId: data.id };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function addOrderMaterial(_: OperationState, formData: FormData): Promise<OperationState> {
  const admin = await requireRole(["super_admin", "manager", "editor", "support", "service_staff"]);
  try {
    const db = await createSupabaseServerClient();
    const orderId = text(formData.get("service_order_id"));
    const financeAllowed = ["super_admin", "manager", "editor"].includes(admin.role);
    const { data, error } = await db.rpc("add_service_order_material", {
      p_service_order_id: orderId,
      p_material_id: optional(formData.get("material_id")),
      p_name: text(formData.get("name")),
      p_category: optional(formData.get("category")),
      p_brand: optional(formData.get("brand")),
      p_model: optional(formData.get("model")),
      p_serial_number: optional(formData.get("serial_number")),
      p_unit: text(formData.get("unit")) || "adet",
      p_quantity: numberOrZero(formData.get("quantity")),
      p_unit_purchase_price: financeAllowed ? optionalNumber(formData.get("unit_purchase_price")) : null,
      p_unit_sale_price: financeAllowed ? optionalNumber(formData.get("unit_sale_price")) : null,
      p_supplier_name: optional(formData.get("supplier_name")),
      p_purchase_date: optional(formData.get("purchase_date")),
      p_document_number: optional(formData.get("document_number")),
      p_warranty_months: optionalNumber(formData.get("warranty_months")),
      p_warranty_start_date: optional(formData.get("warranty_start_date")),
      p_description: optional(formData.get("description")),
    });
    if (error) throw error;
    revalidatePath(`/admin/work-orders/${orderId}`);
    revalidatePath("/admin/inventory");
    return { ok: true, message: "Malzeme iş emrine eklendi.", createdId: String(data) };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function recordPayment(_: OperationState, formData: FormData): Promise<OperationState> {
  await requireRole(["super_admin", "manager", "editor"]);
  try {
    const db = await createSupabaseServerClient();
    const orderId = optional(formData.get("service_order_id"));
    const { data, error } = await db.rpc("record_payment", {
      p_customer_id: text(formData.get("customer_id")),
      p_service_order_id: orderId,
      p_paid_at: new Date(text(formData.get("paid_at")) || Date.now()).toISOString(),
      p_amount: numberOrZero(formData.get("amount")),
      p_currency: text(formData.get("currency")),
      p_method: text(formData.get("method")),
      p_reference_number: optional(formData.get("reference_number")),
      p_collected_by: optional(formData.get("collected_by")),
      p_description: optional(formData.get("description")),
      p_exchange_rate: optionalNumber(formData.get("exchange_rate")),
      p_exchange_rate_date: optional(formData.get("exchange_rate_date")),
      p_idempotency_key: text(formData.get("idempotency_key")),
    });
    if (error) throw error;
    if (orderId) revalidatePath(`/admin/work-orders/${orderId}`);
    revalidatePath("/admin/accounting");
    revalidatePath("/admin/dashboard");
    return { ok: true, message: "Tahsilat kaydedildi.", createdId: String(data) };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function uploadServiceFile(_: OperationState, formData: FormData): Promise<OperationState> {
  const admin = await requireRole(["super_admin", "manager", "editor", "support", "service_staff"]);
  const file = formData.get("file");
  const orderId = text(formData.get("service_order_id"));
  const customerId = text(formData.get("customer_id"));
  const fileKind = text(formData.get("file_kind"));
  if (!(file instanceof File) || file.size === 0) return { error: "Dosya seçin." };
  const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (!allowed.includes(file.type)) return { error: "Yalnızca JPG, PNG, WEBP veya PDF yüklenebilir." };
  if (file.size > 10 * 1024 * 1024) return { error: "Dosya en fazla 10 MB olabilir." };
  if (!["before_photo", "after_photo", "document"].includes(fileKind)) return { error: "Dosya türü geçersiz." };
  try {
    const db = createSupabaseServiceClient();
    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    const path = `${customerId}/${orderId}/${crypto.randomUUID()}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const upload = await db.storage.from("service-files").upload(path, buffer, { contentType: file.type, upsert: false });
    if (upload.error) throw upload.error;
    const { data, error } = await db.from("service_order_files").insert({
      service_order_id: orderId,
      customer_id: customerId,
      file_kind: fileKind,
      storage_path: path,
      original_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      uploaded_by: admin.id,
    }).select("id").single();
    if (error) {
      await db.storage.from("service-files").remove([path]);
      throw error;
    }
    await audit(admin.id, "upload", "service_order_files", data.id, { service_order_id: orderId, file_kind: fileKind, size_bytes: file.size });
    revalidatePath(`/admin/work-orders/${orderId}`);
    return { ok: true, message: "Dosya güvenli depoya yüklendi.", createdId: data.id };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function removeOrderMaterial(_: OperationState, formData: FormData): Promise<OperationState> {
  await requireRole(["super_admin", "manager", "editor", "support", "service_staff"]);
  const orderId = text(formData.get("service_order_id"));
  try {
    const db = await createSupabaseServerClient();
    const { error } = await db.rpc("remove_service_order_material", { p_material_row_id: text(formData.get("material_row_id")) });
    if (error) throw error;
    revalidatePath(`/admin/work-orders/${orderId}`);
    revalidatePath("/admin/inventory");
    return { ok: true, message: "Malzeme geri alındı; stok ve finans toplamları güncellendi." };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function voidPayment(_: OperationState, formData: FormData): Promise<OperationState> {
  await requireRole(["super_admin", "manager", "editor"]);
  const orderId = text(formData.get("service_order_id"));
  try {
    const db = await createSupabaseServerClient();
    const { error } = await db.rpc("void_payment", { p_payment_id: text(formData.get("payment_id")) });
    if (error) throw error;
    revalidatePath(`/admin/work-orders/${orderId}`);
    revalidatePath("/admin/accounting");
    revalidatePath("/admin/dashboard");
    return { ok: true, message: "Tahsilat iptal edildi; geçmiş kayıt korundu." };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}
