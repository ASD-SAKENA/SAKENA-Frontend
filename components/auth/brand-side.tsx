import Image from "next/image";

import { AppIcon } from "@/components/app/app-icon";

const BRAND_POINTS = [
  {
    icon: "account_balance_wallet",
    text: "پرداخت شارژ و مدیریت مالی شفاف",
  },
  { icon: "calendar_month", text: "رزرو امکانات مشترک با تقویم" },
  { icon: "verified_user", text: "امن، ابری و کاملاً فارسی" },
] as const;

const LOGIN_STATS = [
  { value: "۴۸+", label: "واحد فعال" },
  { value: "٪۸۹", label: "نرخ وصول" },
  { value: "۲۴/۷", label: "پشتیبانی" },
] as const;

export function BrandSide() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-[radial-gradient(115%_85%_at_80%_0%,#18223A_0%,#0A0E1A_58%)] px-12 py-[52px] max-[880px]:hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.022)_1px,transparent_1px)] [mask-image:radial-gradient(75%_65%_at_72%_18%,#000_0%,transparent_78%)] bg-[size:40px_40px]" />

      <div className="relative flex items-center gap-[13px]">
        <div className="size-[52px] overflow-hidden rounded-[14px] bg-[var(--sk-bg)] shadow-[0_0_0_1px_rgba(201,162,78,.35),0_8px_22px_rgba(0,0,0,.5)]">
          <Image
            src="/sakena-mark.jpg"
            alt="ساکنا"
            width={52}
            height={52}
            className="size-full object-cover"
          />
        </div>
        <div>
          <div className="text-[21px] font-extrabold tracking-[.5px] text-[var(--sk-text)]">
            ساکِنا
          </div>
          <div className="text-[11.5px] tracking-[1px] text-[var(--sk-text-muted)]">
            SAKENA
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="max-w-[430px] text-[33px] leading-[1.55] font-extrabold text-[var(--sk-text)]">
          مدیریت هوشمند مجتمع‌های مسکونی،
          <br />
          <span className="bg-[linear-gradient(120deg,var(--sk-gold-light),var(--sk-gold))] bg-clip-text text-transparent">
            یکپارچه و بی‌دردسر.
          </span>
        </div>
        <div className="mt-[30px] flex flex-col gap-[15px]">
          {BRAND_POINTS.map((point) => (
            <div key={point.text} className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-[rgba(201,162,78,.13)] text-[var(--sk-gold)]">
                <AppIcon name={point.icon} className="size-[18px]" />
              </div>
              <span className="text-[14.5px] text-[#C7CDD8]">{point.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex flex-wrap gap-[34px]">
        {LOGIN_STATS.map((stat) => (
          <div key={stat.label}>
            <div className="text-[23px] font-extrabold text-[var(--sk-gold-light)]">
              {stat.value}
            </div>
            <div className="mt-1 text-[12px] text-[var(--sk-text-muted)]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
