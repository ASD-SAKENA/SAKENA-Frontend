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
      },
      { label: "اطلاعیه‌ها", icon: "campaign", href: "/announcements" },
      { label: "نظرسنجی‌ها", icon: "chart", href: "/polls" },
      { label: "گفتگوی ساکنین", icon: "chat", href: "/chat" },
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
      },
      { label: "واحدها و ساکنین", icon: "apartment", href: "/units" },
      { label: "دوره‌های شارژ", icon: "payments", href: "/billing" },
      { label: "امکانات", icon: "meeting_room", href: "/reserve" },
      { label: "نظرسنجی‌ها", icon: "chart", href: "/polls" },
      { label: "حساب ساختمان", icon: "wallet", href: "/building-wallet" },
      { label: "گفتگوی ساکنین", icon: "chat", href: "/chat" },
      { label: "پروفایل", icon: "person", href: "/profile" },
    ];
  }
  if (role === "admin") {
    return [
      { label: "کاربران", icon: "group", href: "/users" },
      { label: "پروفایل", icon: "person", href: "/profile" },
    ];
  }
  return [
    { label: "وظایف من", icon: "checklist", href: "/tasks" },
    { label: "تاریخچه کارها", icon: "history", href: "/tasks/history" },
    { label: "اطلاعیه‌ها", icon: "campaign", href: "/announcements" },
    { label: "پروفایل", icon: "person", href: "/profile" },
  ];
}

/** Landing route after login, per role. */
export function roleHomePath(role: Role): string {
  if (role === "manager") return "/dashboard";
  if (role === "staff") return "/tasks";
  if (role === "admin") return "/users";
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
  "/users": ["کاربران", "مدیریت سامانه · فهرست کاربران"],
  "/tasks": ["وظایف من", "خدمات · کارهای ارجاع‌شده به شما"],
  "/tasks/history": ["تاریخچه کارها", "خدمات · آرشیو کارهای انجام‌شده"],
  "/billing": [
    "دوره‌های شارژ",
    "مالی · تعریف دوره، هزینه‌ها و صورت‌حساب واحدها",
  ],
  "/building-wallet": [
    "حساب ساختمان",
    "مالی · موجودی و دفتر تراکنش‌های ساختمان",
  ],
  "/polls": ["نظرسنجی‌ها", "مشارکت · نظرسنجی‌های ساختمان"],
  "/chat": ["گفتگوی ساکنین", "ارتباطات · پیام‌رسان داخلی ساختمان"],
  "/style-guide": ["راهنمای طراحی", "مرجع · رنگ، تایپوگرافی و کامپوننت‌ها"],
};

export function pageMetaForPath(pathname: string): [string, string] {
  return PAGE_META[pathname] ?? ["ساکنا", ""];
}
