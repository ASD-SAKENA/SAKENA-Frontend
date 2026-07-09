import type { StatusColor } from "@/types/app.type";
import type {
  ServiceCategoryGroup,
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
  REJECTED: { label: "ردشده", color: "danger" },
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
