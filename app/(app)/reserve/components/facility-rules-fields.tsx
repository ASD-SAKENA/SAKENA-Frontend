"use client";

import type { UseFormRegister } from "react-hook-form";

import { AppField, AppInput } from "@/components/app/form-controls";

import { cn } from "@/lib/utils";

import { type FacilityForm, WEEK_DAY_OPTIONS } from "@/schemas/facility.schema";

interface Props {
  register: UseFormRegister<FacilityForm>;
  errors: Partial<Record<keyof FacilityForm, { message?: string }>>;
  closedDays: number[];
  onToggleClosedDay: (day: number) => void;
}

/** The scheduling policy half of the facility form. */
export function FacilityRulesFields({
  register,
  errors,
  closedDays,
  onToggleClosedDay,
}: Props) {
  return (
    <>
      <div className="flex gap-2.5">
        <AppField
          label="ساعت شروع"
          error={errors.opensAtHour?.message}
          className="flex-1"
        >
          <AppInput dir="ltr" placeholder="8" {...register("opensAtHour")} />
        </AppField>
        <AppField
          label="ساعت پایان"
          error={errors.closesAtHour?.message}
          className="flex-1"
        >
          <AppInput dir="ltr" placeholder="22" {...register("closesAtHour")} />
        </AppField>
      </div>

      <AppField label="روزهای تعطیل" error={errors.closedDays?.message}>
        <div className="flex flex-wrap gap-2">
          {WEEK_DAY_OPTIONS.map((day) => {
            const active = closedDays.includes(day.value);
            return (
              <button
                key={day.value}
                type="button"
                onClick={() => onToggleClosedDay(day.value)}
                className={cn(
                  "h-9 rounded-[10px] border px-3 text-[12.5px] font-semibold transition-[border-color,background,color]",
                  active
                    ? "border-app-danger bg-[color-mix(in_srgb,var(--ap-danger)_12%,transparent)] text-app-danger"
                    : "border-app-border bg-transparent text-app-fg hover:border-app-gold",
                )}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </AppField>

      <div className="flex gap-2.5">
        <AppField
          label="کمترین مدت (دقیقه)"
          error={errors.minDurationMinutes?.message}
          className="flex-1"
        >
          <AppInput
            dir="ltr"
            placeholder="30"
            {...register("minDurationMinutes")}
          />
        </AppField>
        <AppField
          label="بیشترین مدت (دقیقه)"
          error={errors.maxDurationMinutes?.message}
          className="flex-1"
        >
          <AppInput
            dir="ltr"
            placeholder="120"
            {...register("maxDurationMinutes")}
          />
        </AppField>
      </div>

      <div className="flex gap-2.5">
        <AppField
          label="حداکثر رزرو تا (روز آینده)"
          error={errors.maxAdvanceDays?.message}
          className="flex-1"
        >
          <AppInput
            dir="ltr"
            placeholder="30"
            {...register("maxAdvanceDays")}
          />
        </AppField>
        <AppField
          label="سقف رزرو هر ساکن در هفته (۰ = بی‌نهایت)"
          error={errors.maxPerResidentPerWeek?.message}
          className="flex-1"
        >
          <AppInput
            dir="ltr"
            placeholder="0"
            {...register("maxPerResidentPerWeek")}
          />
        </AppField>
      </div>

      <AppField
        label="هزینه هر ساعت (تومان — ۰ یعنی رایگان)"
        error={errors.hourlyPrice?.message}
      >
        <AppInput dir="ltr" placeholder="0" {...register("hourlyPrice")} />
      </AppField>
    </>
  );
}
