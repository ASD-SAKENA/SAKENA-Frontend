import type { Role } from "@/types/app.type";

export interface NavItem {
  label: string;
  icon: string;
  href: string;
  badge?: string;
}

/** Sidebar navigation per role. `icon` names resolve via AppIcon. */
export function navForRole(role: Role): NavItem[] {
  if (role === "resident") {
    return [
      { label: "داشبورد", icon: "dashboard", href: "/dashboard" },
      { label: "رزرو امکانات", icon: "calendar_month", href: "/reserve" },
      {
        label: "کیف پول و پرداخت",
        icon: "account_balance_wallet",
        href: "/wallet",
      },
      {
        label: "درخواست‌های خدماتی",
        icon: "handyman",
        href: "/requests",
        badge: "۱",
      },
      { label: "اطلاعیه‌ها", icon: "campaign", href: "/announcements" },
      { label: "پروفایل", icon: "person", href: "/profile" },
    ];
  }
  if (role === "manager") {
    return [
      { label: "داشبورد", icon: "dashboard", href: "/dashboard" },
      {
        label: "صف درخواست‌ها",
        icon: "assignment",
        href: "/queue",
        badge: "۵",
      },
      { label: "واحدها و ساکنین", icon: "apartment", href: "/units" },
      { label: "شارژ و هزینه‌ها", icon: "receipt_long", href: "/wallet" },
      { label: "امکانات", icon: "meeting_room", href: "/reserve" },
    ];
  }
  return [
    { label: "وظایف من", icon: "checklist", href: "/tasks", badge: "۳" },
    { label: "تاریخچه کارها", icon: "history", href: "/tasks/history" },
    { label: "اطلاعیه‌ها", icon: "campaign", href: "/announcements" },
    { label: "پروفایل", icon: "person", href: "/profile" },
  ];
}

/** Landing route after login, per role. */
export function roleHomePath(role: Role): string {
  if (role === "manager") return "/dashboard";
  if (role === "staff") return "/tasks";
  return "/dashboard";
}

const PAGE_META: Record<string, [title: string, crumb: string]> = {
  "/dashboard": ["داشبورد", "خانه · خلاصه وضعیت شما"],
  "/reserve": ["رزرو امکانات مشترک", "رزرو امکانات · انتخاب امکان و زمان"],
  "/wallet": ["کیف پول و پرداخت", "مالی · موجودی و تاریخچه تراکنش‌ها"],
  "/requests": ["درخواست‌های خدماتی", "پشتیبانی · ثبت و پیگیری درخواست"],
  "/announcements": ["اطلاعیه‌ها", "ارتباطات · اعلانات ساختمان"],
  "/profile": ["پروفایل", "حساب کاربری · اطلاعات شخصی"],
  "/queue": ["صف درخواست‌ها", "مدیریت · بررسی و ارجاع درخواست‌ها"],
  "/units": ["واحدها و ساکنین", "مدیریت · فهرست واحدها"],
  "/tasks": ["وظایف من", "خدمات · کارهای ارجاع‌شده به شما"],
  "/tasks/history": ["تاریخچه کارها", "خدمات · آرشیو کارهای انجام‌شده"],
  "/style-guide": ["راهنمای طراحی", "مرجع · رنگ، تایپوگرافی و کامپوننت‌ها"],
};

export function pageMetaForPath(pathname: string): [string, string] {
  return PAGE_META[pathname] ?? ["ساکنا", ""];
}
