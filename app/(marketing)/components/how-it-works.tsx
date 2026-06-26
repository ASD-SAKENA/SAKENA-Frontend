import type { LandingStep } from "@/types/landing.type";

import { LandingIcon } from "./landing-icon";
import { SectionHeading } from "./section-heading";

interface Props {
  steps: LandingStep[];
}

export function HowItWorks({ steps }: Props) {
  return (
    <section
      id="how"
      className="mx-auto max-w-[1200px] px-8 py-[90px] max-[560px]:px-5"
    >
      <SectionHeading
        eyebrow="نحوه کار"
        title="در چهار قدم راه‌اندازی کنید"
        className="mb-14"
      />
      <div className="grid grid-cols-4 gap-[18px] max-[900px]:grid-cols-1">
        {steps.map((step) => (
          <div
            key={step.no}
            className="rounded-[18px] border border-[var(--sk-border)] bg-[var(--sk-surface)] p-[26px]"
          >
            <div className="mb-3.5 text-sm font-extrabold text-[var(--sk-gold)]">
              {step.no}
            </div>
            <div className="mb-4 flex size-[46px] items-center justify-center rounded-[13px] bg-[var(--sk-border-subtle)] text-[var(--sk-slate)]">
              <LandingIcon name={step.icon} className="size-6" />
            </div>
            <div className="mb-2 text-[16.5px] font-bold">{step.title}</div>
            <div className="text-[13.5px] leading-[1.9] text-[var(--sk-text-muted)]">
              {step.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
