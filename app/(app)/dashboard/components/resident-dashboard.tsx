"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { KpiCard } from "@/components/app/kpi-card";
import { SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";

import { useAnnouncementsQuery } from "@/queries/announcements";
import { useResidentDashboardQuery } from "@/queries/dashboard";
import { useResidentRequestsQuery } from "@/queries/requests";

import { useAppUiStore } from "@/stores/app-ui.store";

import { faNumber } from "@/lib/persian-number";

import type { StatusColor } from "@/types/app.type";

/** Soft tinted background for an announcement icon chip. */
const CHIP_TINT: Record<StatusColor, string> = {
  gold: "bg-[var(--ap-gold-soft)] text-app-gold",
  success:
    "bg-[color-mix(in_srgb,var(--ap-success)_14%,transparent)] text-app-success",
  warning:
    "bg-[color-mix(in_srgb,var(--ap-warning)_14%,transparent)] text-app-warning",
  danger:
    "bg-[color-mix(in_srgb,var(--ap-danger)_14%,transparent)] text-app-danger",
  info: "bg-[color-mix(in_srgb,var(--ap-info)_14%,transparent)] text-app-info",
  steel:
    "bg-[color-mix(in_srgb,var(--ap-steel)_14%,transparent)] text-app-steel",
  muted:
    "bg-[color-mix(in_srgb,var(--ap-muted)_14%,transparent)] text-app-muted",
};

export function ResidentDashboard() {
  const router = useRouter();
  const { data } = useResidentDashboardQuery();
  const { data: announcements = [] } = useAnnouncementsQuery();
  const { data: requests = [] } = useResidentRequestsQuery();
  const openRequestModal = useAppUiStore((s) => s.openRequestModal);

  if (!data) return null;

  const { kpis, unitInfo, charge } = data;
  const topAnnouncements = announcements.slice(0, 3);
  const recentRequests = requests.slice(0, 3);

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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col rounded-2xl border border-app-border bg-app-surface p-[22px] shadow-[var(--ap-shadow-sm)]">
          <div className="mb-[18px] flex items-center justify-between gap-3">
            <div className="text-[15.5px] font-bold text-app-fg">
              {charge.title}
            </div>
            <StatusBadge color="warning">{charge.dueLabel}</StatusBadge>
          </div>
          <div className="mb-1.5 flex items-baseline gap-2">
            <span className="text-[30px] font-extrabold text-app-fg">
              {faNumber(charge.amount)}
            </span>
            <span className="text-sm text-app-muted">تومان</span>
          </div>
          <div className="my-4 h-2 overflow-hidden rounded-lg bg-app-surface2">
            <div
              className="h-full rounded-lg bg-[linear-gradient(90deg,var(--ap-gold-light),var(--ap-gold))]"
              style={{ width: `${charge.progressPct}%` }}
            />
          </div>
          <div className="mb-5 text-[12.5px] text-app-muted">
            از مانده کیف پول قابل پرداخت است — مانده فعلی{" "}
            {faNumber(charge.walletBalance)} تومان
          </div>
          <div className="mt-auto flex gap-2.5">
            <AppButton
              variant="gold"
              className="h-[46px] flex-1"
              onClick={() => toast.success("پرداخت با موفقیت انجام شد")}
            >
              پرداخت از کیف پول
            </AppButton>
            <AppButton
              variant="outline"
              className="h-[46px]"
              onClick={() => router.push("/wallet")}
            >
              جزئیات
            </AppButton>
          </div>
        </div>

        <SectionCard title="مشخصات واحد" bodyClassName="pt-[18px]">
          {unitInfo.map((row, index) => (
            <div
              key={row.label}
              className={`flex justify-between py-[11px] text-[13.5px] ${
                index < unitInfo.length - 1 ? "border-b border-app-border" : ""
              }`}
            >
              <span className="text-app-muted">{row.label}</span>
              <span className="font-semibold text-app-fg">{row.value}</span>
            </div>
          ))}
        </SectionCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard
          title="آخرین اطلاعیه‌ها"
          bodyClassName="pt-3.5"
          action={
            <Link
              href="/announcements"
              className="text-[12.5px] text-app-gold hover:brightness-110"
            >
              همه
            </Link>
          }
        >
          {topAnnouncements.map((announcement, index) => (
            <div
              key={announcement.id}
              className={`flex gap-3 py-[11px] ${
                index < topAnnouncements.length - 1
                  ? "border-b border-app-border"
                  : ""
              }`}
            >
              <div
                className={`flex size-[34px] shrink-0 items-center justify-center rounded-[9px] ${CHIP_TINT[announcement.color]}`}
              >
                <AppIcon name={announcement.icon} className="size-[19px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 truncate text-[13.5px] font-semibold text-app-fg">
                  {announcement.title}
                </div>
                <div className="text-xs text-app-muted">
                  {announcement.date}
                </div>
              </div>
            </div>
          ))}
        </SectionCard>

        <SectionCard
          title="درخواست‌های اخیر"
          bodyClassName="pt-3.5"
          action={
            <button
              type="button"
              onClick={openRequestModal}
              className="flex items-center gap-1 text-[12.5px] text-app-gold hover:brightness-110"
            >
              <AppIcon name="add" className="size-[17px]" />
              ثبت جدید
            </button>
          }
        >
          {recentRequests.map((request, index) => (
            <div
              key={request.id}
              className={`flex items-center gap-3 py-[11px] ${
                index < recentRequests.length - 1
                  ? "border-b border-app-border"
                  : ""
              }`}
            >
              <AppIcon
                name={request.icon}
                className="size-5 shrink-0 text-app-muted"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-semibold text-app-fg">
                  {request.title}
                </div>
                <div className="text-[11.5px] text-app-muted">
                  {request.date}
                </div>
              </div>
              <StatusBadge color={request.statusColor}>
                {request.status}
              </StatusBadge>
            </div>
          ))}
        </SectionCard>
      </div>
    </>
  );
}
