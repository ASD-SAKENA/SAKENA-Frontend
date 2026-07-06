import type { Announcement } from "@/types/announcements.type";

export const announcementKeys = {
  list: ["announcements"] as const,
};

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    title: "قطعی آب گرم — سرویس موتورخانه",
    date: "۲ تیر ۱۴۰۴",
    icon: "water_drop",
    color: "info",
    body: "به اطلاع ساکنین گرامی می‌رساند روز پنجشنبه ۵ تیر از ساعت ۹ تا ۱۳ آب گرم به دلیل سرویس دوره‌ای موتورخانه قطع خواهد بود.",
  },
  {
    id: "a2",
    title: "مجمع عمومی سالانه ساختمان",
    date: "۳۱ خرداد ۱۴۰۴",
    icon: "groups",
    color: "gold",
    body: "جلسه مجمع عمومی روز جمعه ساعت ۱۷ در سالن همایش برگزار می‌شود. حضور نماینده هر واحد الزامی است.",
  },
  {
    id: "a3",
    title: "به‌روزرسانی سیستم درب پارکینگ",
    date: "۲۸ خرداد ۱۴۰۴",
    icon: "garage",
    color: "success",
    body: "ریموت‌های جدید درب پارکینگ از واحد مدیریت قابل دریافت است. ریموت‌های قدیمی تا پایان تیر غیرفعال می‌شوند.",
  },
  {
    id: "a4",
    title: "یادآوری پرداخت شارژ تیرماه",
    date: "۲۵ خرداد ۱۴۰۴",
    icon: "payments",
    color: "warning",
    body: "مهلت پرداخت شارژ تیرماه تا ۱۰ تیر است. لطفاً نسبت به تسویه از طریق کیف پول اقدام فرمایید.",
  },
];

export async function getAnnouncements(): Promise<Announcement[]> {
  // Mock: the real call will be `http.get<Announcement[]>("/announcements/")`.
  return ANNOUNCEMENTS;
}
