import { GLOBAL_CONFIG } from "@/app/config";

const SITE_URL = GLOBAL_CONFIG.NEXT_PUBLIC_CURRENT_URL;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ساکنا",
    alternateName: "Sakena",
    url: SITE_URL,
    logo: `${SITE_URL}/sakena-mark.jpg`,
    description: "پلتفرم یکپارچه مدیریت مجتمع‌های مسکونی.",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ساکنا",
    url: SITE_URL,
    inLanguage: "fa-IR",
  };
}
