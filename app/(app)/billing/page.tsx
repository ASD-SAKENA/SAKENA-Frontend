"use client";

import { useState } from "react";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { StatusBadge } from "@/components/app/status-badge";

import { useChargePeriodsQuery } from "@/queries/billing";

import { PERIOD_STATUS_META, PERIOD_TYPE_LABELS } from "@/lib/billing";
import { formatFaDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

import { PeriodDetail } from "./components/period-detail";
import { PeriodModal } from "./components/period-modal";

export default function BillingPage() {
  const { data: periods = [] } = useChargePeriodsQuery();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);

  // Falls back to the newest period until the manager picks another.
  const selected =
    periods.find((period) => period.id === selectedId) ?? periods[0] ?? null;

  return (
    <div className="sk-page grid grid-cols-1 gap-4 min-[981px]:grid-cols-[320px_1fr]">
      <div className="flex flex-col gap-3">
        <AppButton
          variant="gold"
          onClick={() => setComposerOpen(true)}
          className="h-[42px] gap-1.5"
        >
          <AppIcon name="add" className="size-[19px]" />
          تعریف دوره شارژ
        </AppButton>

        {periods.length === 0 ? (
          <p className="rounded-2xl border border-app-border bg-app-surface p-5 text-[13px] text-app-muted">
            هنوز دوره‌ای تعریف نشده است. با تعریف دوره، ثبت هزینه‌ها و صدور
            صورت‌حساب واحدها ممکن می‌شود.
          </p>
        ) : null}

        {periods.map((period) => {
          const meta = PERIOD_STATUS_META[period.status];
          const active = selected?.id === period.id;
          return (
            <button
              key={period.id}
              type="button"
              onClick={() => setSelectedId(period.id)}
              className={cn(
                "rounded-2xl border bg-app-surface p-4 text-right transition-colors",
                active
                  ? "border-app-gold shadow-[var(--ap-shadow-sm)]"
                  : "border-app-border hover:border-app-gold",
              )}
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span className="flex-1 text-[14px] font-bold text-app-fg">
                  {period.title}
                </span>
                <StatusBadge color={meta.color}>{meta.label}</StatusBadge>
              </div>
              <div className="text-[12px] text-app-muted">
                {PERIOD_TYPE_LABELS[period.type]} ·{" "}
                {formatFaDate(period.startsOn)} تا {formatFaDate(period.endsOn)}
              </div>
            </button>
          );
        })}
      </div>

      {selected ? (
        <PeriodDetail period={selected} />
      ) : (
        <div className="flex items-center justify-center rounded-2xl border border-app-border bg-app-surface p-10 text-center text-[13.5px] text-app-muted">
          برای مشاهده ردیف‌های هزینه و وضعیت پرداخت واحدها، یک دوره را انتخاب یا
          ایجاد کنید.
        </div>
      )}

      <PeriodModal open={composerOpen} onClose={() => setComposerOpen(false)} />
    </div>
  );
}
