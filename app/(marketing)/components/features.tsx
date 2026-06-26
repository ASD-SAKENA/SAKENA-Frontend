import { cn } from "@/lib/utils";

import type { LandingFeature } from "@/types/landing.type";

import { ACCENT_CHIP } from "./accents";
import { LandingIcon } from "./landing-icon";
import { SectionHeading } from "./section-heading";

interface Props {
  features: LandingFeature[];
}

export function Features({ features }: Props) {
  return (
    <section
      id="features"
      className="mx-auto max-w-[1200px] px-8 py-[90px] max-[560px]:px-5"
    >
      <SectionHeading
        eyebrow="امکانات"
        title="هر آنچه برای اداره‌ی ساختمان لازم است"
        subtitle="از مالی و خدمات تا ارتباطات، همه در یک پلتفرم منسجم و فارسی."
        className="mb-14"
      />
      <div className="grid grid-cols-3 gap-[18px] max-[900px]:grid-cols-1">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-[18px] border border-[var(--sk-border)] bg-[var(--sk-surface)] p-7 transition-[transform,border-color] duration-250 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--sk-gold)_50%,transparent)]"
          >
            <div
              className={cn(
                "mb-[18px] flex size-[50px] items-center justify-center rounded-[14px]",
                ACCENT_CHIP[feature.accent],
              )}
            >
              <LandingIcon name={feature.icon} className="size-[26px]" />
            </div>
            <div className="mb-2.5 text-lg font-bold">{feature.title}</div>
            <div className="text-sm leading-[2] text-[var(--sk-text-muted)]">
              {feature.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
