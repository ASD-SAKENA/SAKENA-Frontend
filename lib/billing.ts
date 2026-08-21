import type { StatusColor } from "@/types/app.type";
import type {
  ChargeItemApiKind,
  ChargePeriodApiStatus,
  ChargePeriodApiType,
  CostAllocationApi,
  InvoiceApiStatus,
  UnitInvoiceApiResponse,
} from "@/types/billing.api.type";

export const PERIOD_STATUS_META: Record<
  ChargePeriodApiStatus,
  { label: string; color: StatusColor }
> = {
  DRAFT: { label: "پیش‌نویس", color: "warning" },
  ISSUED: { label: "صادرشده", color: "info" },
  CLOSED: { label: "بسته‌شده", color: "steel" },
};

export const PERIOD_TYPE_LABELS: Record<ChargePeriodApiType, string> = {
  MONTHLY: "ماهانه",
  QUARTERLY: "فصلی",
  CUSTOM: "دلخواه",
};

export const CHARGE_KIND_LABELS: Record<ChargeItemApiKind, string> = {
  RECURRING_CHARGE: "شارژ دوره‌ای",
  FACILITY_COST: "هزینه امکانات مشترک",
  EXTRAORDINARY_EXPENSE: "هزینه ناگهانی",
};

export const CHARGE_KIND_ICONS: Record<ChargeItemApiKind, string> = {
  RECURRING_CHARGE: "receipt_long",
  FACILITY_COST: "meeting_room",
  EXTRAORDINARY_EXPENSE: "priority_high",
};

export const ALLOCATION_LABELS: Record<CostAllocationApi, string> = {
  EQUAL: "تقسیم مساوی",
  BY_AREA: "بر اساس متراژ",
};

export const INVOICE_STATUS_META: Record<
  InvoiceApiStatus,
  { label: string; color: StatusColor }
> = {
  UNPAID: { label: "پرداخت‌نشده", color: "danger" },
  PARTIALLY_PAID: { label: "پرداخت جزئی", color: "warning" },
  PAID: { label: "تسویه‌شده", color: "success" },
};

/** How urgent an unpaid invoice is, based on the charge period end date. */
export type InvoiceDueUrgency = "overdue" | "due_soon" | "upcoming" | "none";

export const DUE_SOON_DAYS = 3;

/** Calendar day in local time as YYYY-MM-DD for stable date-only compares. */
export function toLocalDateKey(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Parse an API date (LocalDate `YYYY-MM-DD` or ISO datetime) into a comparable
 * day key without shifting across timezones for date-only strings.
 */
export function invoiceDueDateKey(endsOn: string | null | undefined): string {
  if (!endsOn) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(endsOn)) return endsOn;
  return toLocalDateKey(endsOn);
}

export function invoiceDueUrgency(
  endsOn: string | null | undefined,
  today: Date = new Date(),
): InvoiceDueUrgency {
  const dueKey = invoiceDueDateKey(endsOn);
  if (!dueKey) return "none";
  const todayKey = toLocalDateKey(today);
  if (dueKey < todayKey) return "overdue";
  const due = new Date(`${dueKey}T12:00:00`);
  const start = new Date(`${todayKey}T12:00:00`);
  const diffDays = Math.round(
    (due.getTime() - start.getTime()) / (24 * 60 * 60 * 1000),
  );
  if (diffDays <= DUE_SOON_DAYS) return "due_soon";
  return "upcoming";
}

export const INVOICE_DUE_META: Record<
  Exclude<InvoiceDueUrgency, "none">,
  { label: string; color: StatusColor }
> = {
  overdue: { label: "گذشته از سررسید", color: "danger" },
  due_soon: { label: "نزدیک سررسید", color: "warning" },
  upcoming: { label: "در مهلت", color: "info" },
};

/** Unpaid invoices, soonest due first; overdue before everything else. */
export function sortInvoicesByDueDate(
  invoices: UnitInvoiceApiResponse[],
): UnitInvoiceApiResponse[] {
  return [...invoices].sort((a, b) => {
    const aKey = invoiceDueDateKey(a.endsOn) || "9999-12-31";
    const bKey = invoiceDueDateKey(b.endsOn) || "9999-12-31";
    if (aKey !== bKey) return aKey.localeCompare(bKey);
    return a.issuedAt.localeCompare(b.issuedAt);
  });
}
