import { AppButton } from "@/components/app/app-button";
import { SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";

interface Swatch {
  name: string;
  hex: string;
}

const SWATCHES: readonly Swatch[] = [
  { name: "پس‌زمینه", hex: "#0A0E1A" },
  { name: "سطح", hex: "#141A28" },
  { name: "مرز", hex: "#2A3242" },
  { name: "طلایی", hex: "#C9A24E" },
  { name: "طلایی روشن", hex: "#E6CC8A" },
  { name: "نقره‌ای", hex: "#9BA4B4" },
  { name: "موفق", hex: "#3FB984" },
  { name: "هشدار", hex: "#E0A33E" },
  { name: "خطر", hex: "#E5644E" },
  { name: "اطلاع", hex: "#4E8FE5" },
];

export default function StyleGuidePage() {
  return (
    <div className="sk-page flex max-w-[900px] flex-col gap-[18px]">
      <SectionCard title="پالت رنگی">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
          {SWATCHES.map((c) => (
            <div
              key={c.name}
              className="overflow-hidden rounded-[11px] border border-app-border"
            >
              <div className="h-[54px]" style={{ backgroundColor: c.hex }} />
              <div className="px-2.5 py-2">
                <div className="text-[12.5px] font-semibold text-app-fg">
                  {c.name}
                </div>
                <div className="text-right text-[11px] text-app-muted [direction:ltr]">
                  {c.hex}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
        <SectionCard title="تایپوگرافی — Vazirmatn">
          <div className="mb-1.5 text-[30px] font-extrabold text-app-fg">
            سرتیتر بزرگ
          </div>
          <div className="mb-1.5 text-[20px] font-bold text-app-fg">
            عنوان بخش
          </div>
          <div className="mb-1.5 text-[15px] font-semibold text-app-fg">
            عنوان فرعی
          </div>
          <div className="text-[14px] leading-[2] text-app-muted">
            متن بدنه — اعداد فارسی ۱۲۳۴۵۶۷۸۹۰ با واحد تومان نمایش داده می‌شوند.
          </div>
        </SectionCard>

        <SectionCard title="دکمه‌ها و وضعیت‌ها">
          <div className="mb-[18px] flex flex-wrap gap-2.5">
            <AppButton variant="gold">اصلی</AppButton>
            <AppButton variant="outline">ثانویه</AppButton>
            <AppButton variant="ghost">شبح</AppButton>
            <AppButton variant="gold" disabled>
              غیرفعال
            </AppButton>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge color="success">موفق</StatusBadge>
            <StatusBadge color="warning">در انتظار</StatusBadge>
            <StatusBadge color="danger">معوق</StatusBadge>
            <StatusBadge color="info">در حال انجام</StatusBadge>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
