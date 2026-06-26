import type { LandingContent } from "@/types/landing.type";

export const landingKeys = {
  content: ["landing", "content"] as const,
};

/**
 * Mocked landing content. When the backend is ready, swap the body for:
 *   const { data } = await http.get<LandingContent>("/landing/content/");
 *   return data;
 * The signature and return type stay identical, so callers don't change.
 */
const LANDING_CONTENT: LandingContent = {
  hero: {
    url: "app.sakena.ir/dashboard",
    kpis: [
      { label: "وصولی این ماه", value: "۳۲٫۴ م", accent: "gold" },
      { label: "نرخ وصول", value: "٪۸۹", accent: "green" },
    ],
    bars: [52, 64, 48, 78, 70, 92],
    badgeLabel: "شارژ پرداخت شد",
    badgeValue: "۸۵۰٬۰۰۰ تومان",
  },
  stats: [
    { value: "۴۸+", label: "واحد فعال" },
    { value: "٪۸۹", label: "میانگین نرخ وصول" },
    { value: "۲۴/۷", label: "پشتیبانی" },
    { value: "<۱۰ دقیقه", label: "زمان راه‌اندازی" },
  ],
  features: [
    {
      icon: "wallet",
      title: "مدیریت مالی و شارژ",
      description:
        "تعریف دوره‌ی شارژ، کیف پول داخلی، درگاه امن و گزارش وصولی لحظه‌ای.",
      accent: "gold",
    },
    {
      icon: "calendar",
      title: "رزرو امکانات مشترک",
      description:
        "رزرو استخر، سالن ورزش و همایش با تقویم و مدیریت بازه‌های زمانی.",
      accent: "blue",
    },
    {
      icon: "wrench",
      title: "درخواست‌های خدماتی",
      description:
        "ثبت، ارجاع به کارکن و پیگیری وضعیت تعمیرات و خدمات ساختمان.",
      accent: "green",
    },
    {
      icon: "megaphone",
      title: "اطلاع‌رسانی",
      description:
        "انتشار اطلاعیه و اعلانات فوری برای همه‌ی ساکنین در یک لحظه.",
      accent: "amber",
    },
    {
      icon: "building",
      title: "مدیریت واحدها",
      description: "فهرست واحدها و ساکنین، وضعیت سکونت و مانده‌ی حساب هر واحد.",
      accent: "slate",
    },
    {
      icon: "chart",
      title: "گزارش‌ها و تحلیل",
      description: "داشبورد شاخص‌های کلیدی، روند وصولی و وضعیت پرداخت واحدها.",
      accent: "red",
    },
  ],
  roles: [
    {
      key: "resident",
      label: "ساکن",
      icon: "home",
      title: "برای ساکنین",
      description:
        "پرداخت شارژ، رزرو امکانات و پیگیری درخواست‌ها — همه از گوشی، در چند ثانیه.",
      points: [
        "پرداخت شارژ از کیف پول داخلی",
        "رزرو استخر، سالن ورزش و آلاچیق",
        "ثبت و پیگیری درخواست خدماتی",
        "دریافت آنی اطلاعیه‌های ساختمان",
      ],
      quote:
        "«دیگه دنبال مدیر ساختمان نمی‌گردم؛ شارژ رو همون شب با موبایل پرداخت می‌کنم و رزرو سالن ورزش هم چند ثانیه‌ست.»",
      author: "مهندس رضایی",
      authorRole: "ساکن واحد ۱۲",
      avatar: "ر",
    },
    {
      key: "manager",
      label: "مدیر",
      icon: "shield",
      title: "برای مدیران",
      description:
        "دید کامل بر مالی، درخواست‌ها و ساکنین مجتمع — با گزارش‌های لحظه‌ای و ابزار وصول شارژ.",
      points: [
        "داشبورد KPI و گزارش وصولی شارژ",
        "مدیریت واحدها، ساکنین و بدهی‌ها",
        "ارجاع درخواست‌ها به کارکنان",
        "تعریف دوره‌ی شارژ و انتشار اطلاعیه",
      ],
      quote:
        "«نرخ وصول شارژمون از ۶۸٪ به ۸۹٪ رسید. همه‌چیز شفافه و دیگه دفتر و دستک کاغذی نداریم.»",
      author: "سرکار خانم احمدی",
      authorRole: "مدیر برج نیلوفر",
      avatar: "ا",
    },
    {
      key: "staff",
      label: "کارکن",
      icon: "engineering",
      title: "برای کارکنان",
      description:
        "فهرست شفاف کارهای ارجاع‌شده با اولویت، و ثبت سریع گزارش انجام کار.",
      points: [
        "دریافت آنی کارهای ارجاع‌شده",
        "مشاهده‌ی اولویت و جزئیات هر کار",
        "ثبت گزارش انجام با چند لمس",
        "خلاصه‌ی روزانه‌ی وظایف",
      ],
      quote:
        "«کارها با اولویت مشخص میاد دستم، بعد از انجام هم سریع گزارش می‌دم. هماهنگی خیلی راحت‌تر شده.»",
      author: "آقای کریمی",
      authorRole: "کارکن خدماتی",
      avatar: "ک",
    },
  ],
  steps: [
    {
      no: "۰۱",
      icon: "building",
      title: "ثبت مجتمع",
      description: "اطلاعات ساختمان و واحدها را وارد کنید.",
    },
    {
      no: "۰۲",
      icon: "user-plus",
      title: "دعوت ساکنین",
      description: "ساکنین با پیامک به سامانه دعوت می‌شوند.",
    },
    {
      no: "۰۳",
      icon: "receipt",
      title: "تعریف شارژ",
      description: "دوره و مبلغ شارژ ماهانه را مشخص کنید.",
    },
    {
      no: "۰۴",
      icon: "rocket",
      title: "شروع کنید",
      description: "مدیریت یکپارچه از همان روز اول.",
    },
  ],
  faqs: [
    {
      question: "آیا راه‌اندازی ساکنا پیچیده است؟",
      answer:
        "خیر. اطلاعات واحدها و ساکنین را وارد می‌کنید و در کمتر از ۱۰ دقیقه سامانه آماده‌ی استفاده است. تیم پشتیبانی نیز در تمام مراحل همراه شماست.",
    },
    {
      question: "پرداخت شارژ چگونه انجام می‌شود؟",
      answer:
        "ساکنین می‌توانند از طریق کیف پول داخلی یا درگاه پرداخت امن، شارژ ماهانه را تسویه کنند. تمام تراکنش‌ها در تاریخچه‌ی شفاف ثبت می‌شود.",
    },
    {
      question: "آیا اطلاعات ساختمان امن است؟",
      answer:
        "بله. تمام داده‌ها رمزنگاری شده و به‌صورت ابری پشتیبان‌گیری می‌شوند. دسترسی هر نقش (ساکن، مدیر، کارکن) دقیقاً محدود به وظایف خودش است.",
    },
    {
      question: "روی موبایل هم کار می‌کند؟",
      answer:
        "بله، ساکنا کاملاً ریسپانسیو است و روی موبایل با ناوبری پایین و کارت‌های تمام‌عرض تجربه‌ای روان ارائه می‌دهد.",
    },
  ],
  footerColumns: [
    {
      title: "محصول",
      links: ["امکانات", "نحوه کار", "قیمت‌گذاری", "اپلیکیشن موبایل"],
    },
    {
      title: "شرکت",
      links: ["درباره ما", "وبلاگ", "تماس با ما", "فرصت‌های شغلی"],
    },
    {
      title: "پشتیبانی",
      links: ["راهنما", "سؤالات متداول", "وضعیت سرویس", "گزارش مشکل"],
    },
  ],
};

export async function getLandingContent(): Promise<LandingContent> {
  return LANDING_CONTENT;
}
