import type {
  CreateRequestPayload,
  ManagerRequest,
  ServiceRequest,
} from "@/types/requests.type";

export const requestKeys = {
  all: ["requests"] as const,
  resident: ["requests", "resident"] as const,
  manager: ["requests", "manager"] as const,
};

const RESIDENT_REQUESTS: ServiceRequest[] = [
  {
    id: "۱۰۲۴",
    icon: "plumbing",
    title: "نشتی شیر آب آشپزخانه",
    type: "تأسیسات",
    description: "شیر آب سینک ظرفشویی چکه می‌کند.",
    status: "در حال انجام",
    statusColor: "info",
    date: "دیروز",
  },
  {
    id: "۱۰۱۹",
    icon: "bolt",
    title: "خرابی روشنایی راهرو طبقه ۴",
    type: "برق",
    description: "دو لامپ راهروی مشترک سوخته است.",
    status: "ارجاع‌شده",
    statusColor: "warning",
    date: "۲ تیر",
  },
  {
    id: "۱۰۰۵",
    icon: "elevator",
    title: "صدای غیرعادی آسانسور",
    type: "آسانسور",
    description: "هنگام توقف صدای ناهنجار شنیده می‌شود.",
    status: "انجام‌شده",
    statusColor: "success",
    date: "۲۸ خرداد",
  },
  {
    id: "۰۹۸۸",
    icon: "ac_unit",
    title: "سرویس کولر گازی واحد",
    type: "تأسیسات",
    description: "درخواست شارژ گاز و سرویس دوره‌ای.",
    status: "انجام‌شده",
    statusColor: "success",
    date: "۲۰ خرداد",
  },
];

const MANAGER_REQUESTS: ManagerRequest[] = [
  {
    id: "۱۰۲۴",
    title: "نشتی شیر آب آشپزخانه",
    type: "تأسیسات",
    unit: "۱۲",
    priority: "متوسط",
    priorityColor: "warning",
    status: "در حال انجام",
    statusColor: "info",
  },
  {
    id: "۱۰۲۳",
    title: "قطعی برق پارکینگ",
    type: "برق",
    unit: "مشاعات",
    priority: "فوری",
    priorityColor: "danger",
    status: "باز",
    statusColor: "warning",
  },
  {
    id: "۱۰۲۲",
    title: "خرابی آیفون تصویری",
    type: "الکترونیک",
    unit: "۲۸",
    priority: "متوسط",
    priorityColor: "warning",
    status: "باز",
    statusColor: "warning",
  },
  {
    id: "۱۰۲۱",
    title: "گرفتگی لوله فاضلاب",
    type: "تأسیسات",
    unit: "۷",
    priority: "فوری",
    priorityColor: "danger",
    status: "ارجاع‌شده",
    statusColor: "info",
  },
  {
    id: "۱۰۲۰",
    title: "تعویض لامپ‌های راه‌پله",
    type: "برق",
    unit: "مشاعات",
    priority: "کم",
    priorityColor: "success",
    status: "باز",
    statusColor: "warning",
  },
  {
    id: "۱۰۱۹",
    title: "سرویس آسانسور شماره ۲",
    type: "آسانسور",
    unit: "مشاعات",
    priority: "متوسط",
    priorityColor: "warning",
    status: "انجام‌شده",
    statusColor: "success",
  },
];

export async function getResidentRequests(): Promise<ServiceRequest[]> {
  return RESIDENT_REQUESTS;
}

export async function getManagerRequests(): Promise<ManagerRequest[]> {
  return MANAGER_REQUESTS;
}

export async function createRequest(
  payload: CreateRequestPayload,
): Promise<{ id: string }> {
  // Mock: the real call will be `http.post("/requests/", payload)`.
  return { id: String(Date.now()) };
}
