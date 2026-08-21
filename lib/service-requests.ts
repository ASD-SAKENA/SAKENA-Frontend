import type { StatusColor } from "@/types/app.type";
import type {
  ServiceCategoryGroup,
  ServiceCostResponsibility,
  ServiceRequestApiStatus,
} from "@/types/requests.api.type";
import type { RequestStatus } from "@/types/requests.type";

/** Backend status → Persian label + badge color used across all request views. */
export const REQUEST_STATUS_META: Record<
  ServiceRequestApiStatus,
  { label: RequestStatus; color: StatusColor }
> = {
  PENDING: { label: "باز", color: "warning" },
  APPROVED: { label: "تأییدشده", color: "info" },
  ASSIGNED: { label: "ارجاع‌شده", color: "info" },
  IN_PROGRESS: { label: "در حال انجام", color: "info" },
  COMPLETED: { label: "انجام‌شده", color: "success" },
  CONFIRMED: { label: "تایید شده", color: "success" },
  SETTLED: { label: "تسویه‌شده", color: "steel" },
  REJECTED: { label: "ردشده", color: "danger" },
};

/**
 * Where a status sits in the request's life, for the list filters.
 *
 * Filtering used to compare the Persian label, so anything without an exact
 * match — a confirmed, settled or rejected request — silently counted as
 * open. Deriving the group from the backend status keeps every screen
 * agreeing with the API, and adding a status is a compile error here.
 */
export type RequestStatusGroup = "open" | "progress" | "done" | "rejected";

export const REQUEST_STATUS_GROUP: Record<
  ServiceRequestApiStatus,
  RequestStatusGroup
> = {
  PENDING: "open",
  APPROVED: "open",
  ASSIGNED: "progress",
  IN_PROGRESS: "progress",
  // Staff finished, but a resident still has to confirm before payout.
  COMPLETED: "progress",
  CONFIRMED: "done",
  SETTLED: "done",
  REJECTED: "rejected",
};

export function statusGroupOf(
  status: ServiceRequestApiStatus,
): RequestStatusGroup {
  return REQUEST_STATUS_GROUP[status];
}

/**
 * The three ways a completed request's cost can be paid, in the order the
 * manager sees them. `requiresRequestingUnit` mirrors the backend guard: a
 * request with no requesting apartment can only be paid from the building
 * wallet, since there is no unit to bill.
 */
export const COST_RESPONSIBILITY_OPTIONS: {
  value: ServiceCostResponsibility;
  label: string;
  description: string;
  icon: string;
  requiresRequestingUnit: boolean;
}[] = [
  {
    value: "ALL_UNITS",
    label: "تقسیم بین همه واحدها",
    description:
      "دستمزد الان از کیف پول ساختمان پرداخت می‌شود؛ مبلغ در صدور دوره بعد بین همه واحدها تقسیم می‌شود.",
    icon: "apartment",
    requiresRequestingUnit: true,
  },
  {
    value: "REQUESTING_UNIT",
    label: "بر عهده واحد درخواست‌دهنده",
    description:
      "دستمزد الان از کیف پول ساختمان پرداخت می‌شود؛ کل مبلغ در صورت‌حساب دوره بعد همان واحد می‌آید.",
    icon: "person",
    requiresRequestingUnit: true,
  },
  {
    value: "BUILDING_WALLET",
    label: "از کیف پول ساختمان",
    description:
      "دستمزد از موجودی ساختمان پرداخت می‌شود و به شارژ واحدها اضافه نمی‌شود.",
    icon: "account_balance_wallet",
    requiresRequestingUnit: false,
  },
];

export const COST_RESPONSIBILITY_LABELS: Record<
  ServiceCostResponsibility,
  string
> = {
  ALL_UNITS: "تقسیم بین همه واحدها",
  REQUESTING_UNIT: "بر عهده واحد درخواست‌دهنده",
  BUILDING_WALLET: "از کیف پول ساختمان",
};

/** Persian labels mirroring the backend `ServiceCategoryGroup.persianName`. */
export const CATEGORY_GROUP_LABELS: Record<ServiceCategoryGroup, string> = {
  FACILITIES: "تاسیسات",
  BUILDING: "ساختمان",
  CLEANING: "نظافت",
  SECURITY: "امنیت",
  GREEN_SPACE: "فضای سبز",
  COMMUNICATION: "ارتباطات",
  GENERAL: "عمومی",
};

export const CATEGORY_GROUP_ICONS: Record<ServiceCategoryGroup, string> = {
  FACILITIES: "plumbing",
  BUILDING: "apartment",
  CLEANING: "cleaning_services",
  SECURITY: "shield",
  GREEN_SPACE: "park",
  COMMUNICATION: "wifi",
  GENERAL: "handyman",
};

/** Persian labels mirroring the backend `ServiceSubCategory.persianName`. */
export const SUB_CATEGORY_LABELS: Record<string, string> = {
  ELECTRICAL: "برق",
  PLUMBING: "لوله‌کشی",
  HVAC: "گرمایش/سرمایش",
  ELEVATOR: "آسانسور",
  GAS: "گاز",
  ROOF_WALL: "سقف و دیوار",
  DOOR_WINDOW: "در و پنجره",
  FLOORING: "کف‌پوش",
  FACADE: "نما",
  CLEANING: "نظافت عمومی",
  WASTE: "دفع زباله",
  PESTS: "آفات",
  TANK_CLEANING: "نظافت مخازن",
  ENTRANCE: "درب ورودی",
  CCTV: "دوربین مداربسته",
  PARKING: "پارکینگ",
  LIGHTING: "نورپردازی",
  GARDEN: "باغچه",
  LANDSCAPE: "محوطه",
  POOL: "استخر",
  INTERNET: "اینترنت",
  ALARM: "دزدگیر",
  TV_ANTENNA: "آنتن و تلویزیون",
  GENERAL: "سایر/عمومی",
  GUEST: "مهمانان",
  DELIVERY: "تحویل",
  DOCUMENTS: "مدارک",
};

export function subCategoryLabel(value: string): string {
  return SUB_CATEGORY_LABELS[value] ?? value;
}

/** Short, human-friendly slice of the request UUID for display. */
export function shortRequestId(id: string): string {
  return id.slice(0, 8);
}
