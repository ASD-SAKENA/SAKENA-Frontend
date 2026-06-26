import type { Metadata } from "next";

import { GLOBAL_CONFIG } from "@/app/config";

const TITLE = "ساکنا — پلتفرم یکپارچه مدیریت ساختمان";
const DESCRIPTION =
  "شارژ و حساب‌ها، رزرو امکانات مشترک، درخواست‌های خدماتی و اطلاع‌رسانی — همه در یک سامانه‌ی امن برای ساکنین، مدیران و کارکنان ساختمان.";

export const siteMetadata: Metadata = {
  metadataBase: new URL(GLOBAL_CONFIG.NEXT_PUBLIC_CURRENT_URL),
  title: {
    default: TITLE,
    template: "%s | ساکنا",
  },
  description: DESCRIPTION,
  applicationName: "ساکنا",
  keywords: [
    "مدیریت ساختمان",
    "شارژ ساختمان",
    "مدیریت مجتمع مسکونی",
    "ساکنا",
    "Sakena",
  ],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "ساکنا",
    title: TITLE,
    description: DESCRIPTION,
    url: GLOBAL_CONFIG.NEXT_PUBLIC_CURRENT_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
};
