"use client";

import { AppIcon } from "@/components/app/app-icon";

import { useStaffHistoryQuery } from "@/queries/tasks";

export default function TaskHistoryPage() {
  const { data: history = [] } = useStaffHistoryQuery();

  return (
    <div className="sk-page flex max-w-[820px] flex-col gap-3">
      {history.length === 0 ? (
        <div className="rounded-2xl border border-app-border bg-app-surface p-8 text-center text-[13.5px] text-app-muted">
          هنوز کاری را به پایان نرسانده‌اید. کارهای انجام‌شده اینجا آرشیو
          می‌شوند.
        </div>
      ) : null}

      {history.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-app-border bg-app-surface p-[18px] shadow-[var(--ap-shadow-sm)]"
        >
          <div className="mb-2.5 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-app-surface2">
              <AppIcon name={item.icon} className="size-5 text-app-steel" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14.5px] font-bold text-app-fg">
                {item.title}
              </div>
              <div className="mt-[3px] text-[12.5px] text-app-muted">
                واحد {item.unit} · اتمام: {item.completedAt}
              </div>
            </div>
            {item.cost ? (
              <div className="text-left">
                <div className="text-[11.5px] text-app-muted">هزینه</div>
                <div className="text-[14px] font-bold text-app-gold">
                  {item.cost}{" "}
                  <span className="text-[11px] font-normal text-app-muted">
                    تومان
                  </span>
                </div>
              </div>
            ) : null}
          </div>
          <p className="rounded-xl bg-app-surface2 px-3.5 py-2.5 text-[13px] leading-[1.9] text-app-muted">
            {item.report}
          </p>
        </div>
      ))}
    </div>
  );
}
