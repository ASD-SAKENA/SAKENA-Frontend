import type { Unit } from "@/types/units.type";

export const unitKeys = {
  all: ["units"] as const,
  list: ["units", "list"] as const,
};

const UNITS: Unit[] = [
  {
    no: "۱۲",
    resident: "مهندس رضایی",
    tenancy: "مالک ساکن",
    balance: "۸۵۰٬۰۰۰",
    balanceColor: "warning",
    status: "بدهکار",
    statusColor: "warning",
  },
  {
    no: "۱۴",
    resident: "خانم موسوی",
    tenancy: "مستأجر",
    balance: "۰",
    balanceColor: "success",
    status: "تسویه",
    statusColor: "success",
  },
  {
    no: "۲۱",
    resident: "آقای نیکزاد",
    tenancy: "مالک ساکن",
    balance: "۰",
    balanceColor: "success",
    status: "تسویه",
    statusColor: "success",
  },
  {
    no: "۲۸",
    resident: "شرکت آرمان",
    tenancy: "تجاری",
    balance: "۱٬۷۰۰٬۰۰۰",
    balanceColor: "danger",
    status: "معوق",
    statusColor: "danger",
  },
  {
    no: "۳۲",
    resident: "خانم کاظمی",
    tenancy: "مستأجر",
    balance: "۰",
    balanceColor: "success",
    status: "تسویه",
    statusColor: "success",
  },
  {
    no: "۴۵",
    resident: "واحد خالی",
    tenancy: "بدون سکونت",
    balance: "۰",
    balanceColor: "muted",
    status: "خالی",
    statusColor: "info",
  },
];

export async function getUnits(): Promise<Unit[]> {
  // Mock: the real call will be `http.get<Unit[]>("/units/")`.
  return UNITS;
}
