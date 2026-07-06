import type {
  ManagerDashboard,
  ResidentDashboard,
} from "@/types/dashboard.type";

export const dashboardKeys = {
  resident: ["dashboard", "resident"] as const,
  manager: ["dashboard", "manager"] as const,
};

const RESIDENT_DASHBOARD: ResidentDashboard = {
  kpis: [
    {
      label: "مانده کیف پول",
      value: "۲٬۴۵۰٬۰۰۰",
      icon: "account_balance_wallet",
      color: "gold",
      sub: "تومان",
    },
    {
      label: "شارژ این ماه",
      value: "۸۵۰٬۰۰۰",
      icon: "receipt_long",
      color: "warning",
      sub: "سررسید ۱۰ تیر",
    },
    {
      label: "درخواست‌های باز",
      value: "۱",
      icon: "handyman",
      color: "info",
      sub: "در حال بررسی",
    },
    {
      label: "رزروهای پیش‌رو",
      value: "۲",
      icon: "event_available",
      color: "success",
      sub: "سالن ورزش، آلاچیق",
    },
  ],
  unitInfo: [
    { label: "شماره واحد", value: "۱۲ — طبقه ۴" },
    { label: "متراژ", value: "۱۲۵ متر مربع" },
    { label: "تعداد پارکینگ", value: "۱ واحد" },
    { label: "وضعیت سکونت", value: "مالک ساکن" },
  ],
  charge: {
    title: "شارژ ماهانه — تیر ۱۴۰۴",
    amount: 850000,
    dueLabel: "سررسید ۱۰ تیر",
    progressPct: 64,
    walletBalance: 2450000,
  },
};

const MANAGER_DASHBOARD: ManagerDashboard = {
  kpis: [
    {
      label: "کل واحدها",
      value: "۴۸",
      icon: "apartment",
      color: "info",
      sub: "۴۵ سکونت فعال",
      subColor: "muted",
    },
    {
      label: "وصولی این ماه",
      value: "۳۲٫۴ م",
      icon: "payments",
      color: "gold",
      sub: "۸۵٪ از هدف",
      subColor: "success",
    },
    {
      label: "درخواست‌های باز",
      value: "۵",
      icon: "assignment",
      color: "warning",
      sub: "۲ فوری",
      subColor: "danger",
    },
    {
      label: "نرخ وصول",
      value: "٪۸۹",
      icon: "trending_up",
      color: "success",
      sub: "+۸٪ نسبت به ماه قبل",
      subColor: "success",
    },
  ],
  chart: [
    { label: "بهمن", heightPct: 52 },
    { label: "اسفند", heightPct: 64 },
    { label: "فروردین", heightPct: 48 },
    { label: "اردیبهشت", heightPct: 78 },
    { label: "خرداد", heightPct: 70 },
    { label: "تیر", heightPct: 92 },
  ],
  breakdown: [
    { label: "پرداخت‌شده", count: "۴۰ واحد", pct: 83, color: "success" },
    { label: "در انتظار", count: "۵ واحد", pct: 10, color: "warning" },
    { label: "معوق", count: "۳ واحد", pct: 7, color: "danger" },
  ],
};

export async function getResidentDashboard(): Promise<ResidentDashboard> {
  // Mock: the real call will be `http.get<ResidentDashboard>("/dashboard/resident/")`.
  return RESIDENT_DASHBOARD;
}

export async function getManagerDashboard(): Promise<ManagerDashboard> {
  // Mock: the real call will be `http.get<ManagerDashboard>("/dashboard/manager/")`.
  return MANAGER_DASHBOARD;
}
