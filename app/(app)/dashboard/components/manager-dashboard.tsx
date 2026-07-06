"use client";

import { KpiCard } from "@/components/app/kpi-card";
import { SectionCard } from "@/components/app/section-card";

import { useManagerDashboardQuery } from "@/queries/dashboard";

import type { StatusColor } from "@/types/app.type";

/** Solid fill for a payment-breakdown progress bar. */
const BAR_FILL: Record<StatusColor, string> = {
  gold: "bg-app-gold",
  success: "bg-app-success",
  warning: "bg-app-warning",
  danger: "bg-app-danger",
  info: "bg-app-info",
  steel: "bg-app-steel",
  muted: "bg-app-muted",
};

export function ManagerDashboard() {
  const { data } = useManagerDashboardQuery();

  if (!data) return null;

  const { kpis, chart, breakdown } = data;

  return (
    <>
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            color={kpi.color}
            sub={kpi.sub}
            subColor={kpi.subColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <SectionCard
          title="روند وصولی شارژ (۶ ماه اخیر)"
          bodyClassName="pt-6"
          action={
            <span className="text-[12.5px] font-semibold text-app-success">
              +۸٪ نسبت به فصل قبل
            </span>
          }
        >
          <div className="flex h-[180px] items-end gap-3.5 pt-2.5">
            {chart.map((bar) => (
              <div
                key={bar.label}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <div
                  className="w-full max-w-[42px] rounded-t-lg bg-[linear-gradient(180deg,var(--ap-gold-light),var(--ap-gold))]"
                  style={{ height: `${bar.heightPct}%` }}
                />
                <span className="text-[11.5px] text-app-muted">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="وضعیت پرداخت واحدها" bodyClassName="pt-5">
          {breakdown.map((row) => (
            <div key={row.label} className="mb-[18px] last:mb-0">
              <div className="mb-2 flex justify-between text-[13px]">
                <span className="text-app-fg">{row.label}</span>
                <span className="font-bold text-app-fg">{row.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-lg bg-app-surface2">
                <div
                  className={`h-full ${BAR_FILL[row.color]}`}
                  style={{ width: `${row.pct}%` }}
                />
              </div>
            </div>
          ))}
        </SectionCard>
      </div>
    </>
  );
}
