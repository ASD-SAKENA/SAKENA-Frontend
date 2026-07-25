import type { StatusColor } from "@/types/app.type";
import type {
  ChargeItemApiKind,
  ChargePeriodApiStatus,
  ChargePeriodApiType,
  CostAllocationApi,
  InvoiceApiStatus,
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
