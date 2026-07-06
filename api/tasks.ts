import type { StaffTask, SummaryItem } from "@/types/tasks.type";

export const taskKeys = {
  all: ["tasks"] as const,
  staff: ["tasks", "staff"] as const,
  summary: ["tasks", "summary"] as const,
};

const STAFF_TASKS: StaffTask[] = [
  {
    icon: "plumbing",
    title: "نشتی شیر آب آشپزخانه",
    unit: "۱۲",
    date: "امروز ۹:۳۰",
    priority: "متوسط",
    priorityColor: "warning",
    done: false,
  },
  {
    icon: "water_damage",
    title: "گرفتگی لوله فاضلاب",
    unit: "۷",
    date: "امروز ۸:۰۰",
    priority: "فوری",
    priorityColor: "danger",
    done: false,
  },
  {
    icon: "bolt",
    title: "تعویض لامپ‌های راه‌پله",
    unit: "مشاعات",
    date: "دیروز",
    priority: "کم",
    priorityColor: "success",
    done: false,
  },
  {
    icon: "ac_unit",
    title: "سرویس کولر گازی",
    unit: "۲۸",
    date: "۲۸ خرداد",
    priority: "متوسط",
    priorityColor: "warning",
    done: true,
  },
];

const STAFF_SUMMARY: SummaryItem[] = [
  {
    label: "کارهای باز",
    value: "۳",
    icon: "pending_actions",
    color: "warning",
  },
  { label: "انجام‌شده امروز", value: "۲", icon: "task_alt", color: "success" },
  { label: "فوری", value: "۱", icon: "priority_high", color: "danger" },
];

export async function getStaffTasks(): Promise<StaffTask[]> {
  // Mock: the real call will be `http.get<StaffTask[]>("/tasks/staff/")`.
  return STAFF_TASKS;
}

export async function getStaffSummary(): Promise<SummaryItem[]> {
  // Mock: the real call will be `http.get<SummaryItem[]>("/tasks/summary/")`.
  return STAFF_SUMMARY;
}
