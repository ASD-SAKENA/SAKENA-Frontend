import { ArrowLeft, Phone } from "lucide-react";

import { GoldButton, OutlineButton } from "./landing-buttons";

export function Cta() {
  return (
    <section className="mx-auto max-w-[1100px] px-8 py-[90px] max-[560px]:px-5">
      <div className="relative overflow-hidden rounded-[26px] border border-[color-mix(in_srgb,var(--sk-gold)_30%,transparent)] bg-[radial-gradient(120%_140%_at_50%_0%,#1a2336_0%,var(--sk-bg-band)_65%)] px-10 py-16 text-center">
        <div className="pointer-events-none absolute -top-[60px] left-1/2 h-[300px] w-[500px] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,color-mix(in_srgb,var(--sk-gold)_18%,transparent)_0%,transparent_70%)]" />
        <div className="relative">
          <h2 className="mb-4 text-[38px] font-black">
            ساختمان‌تان را هوشمند کنید
          </h2>
          <p className="mx-auto mb-8 max-w-[520px] text-[16.5px] leading-[2] text-[var(--sk-text-muted)]">
            همین امروز ساکنا را رایگان امتحان کنید. بدون نیاز به کارت بانکی،
            راه‌اندازی در کمتر از ۱۰ دقیقه.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <GoldButton href="/login" className="h-[54px] px-[30px] text-base">
              شروع رایگان
              <ArrowLeft className="size-5" />
            </GoldButton>
            <OutlineButton href="#" className="h-[54px] px-7 text-[15.5px]">
              <Phone className="size-5 text-[var(--sk-gold)]" />
              تماس با فروش
            </OutlineButton>
          </div>
        </div>
      </div>
    </section>
  );
}
