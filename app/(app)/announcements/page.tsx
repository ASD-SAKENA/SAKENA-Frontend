"use client";

import { useState } from "react";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { NoUnitNotice } from "@/components/app/no-unit-notice";

import { useAnnouncementsQuery } from "@/queries/announcements";
import { useResidentDashboardQuery } from "@/queries/dashboard";

import { useAuthStore } from "@/stores/auth.store";

import { faNumber } from "@/lib/persian-number";
import { cn } from "@/lib/utils";

import type { StatusColor } from "@/types/app.type";

import { AnnouncementModal } from "./components/announcement-modal";

const ACCENT: Record<StatusColor, string> = {
  gold: "border-r-app-gold",
  success: "border-r-app-success",
  warning: "border-r-app-warning",
  danger: "border-r-app-danger",
  info: "border-r-app-info",
  steel: "border-r-app-steel",
  muted: "border-r-app-muted",
};

const CHIP: Record<StatusColor, string> = {
  gold: "text-app-gold bg-[color-mix(in_srgb,var(--ap-gold)_14%,transparent)]",
  success:
    "text-app-success bg-[color-mix(in_srgb,var(--ap-success)_14%,transparent)]",
  warning:
    "text-app-warning bg-[color-mix(in_srgb,var(--ap-warning)_14%,transparent)]",
  danger:
    "text-app-danger bg-[color-mix(in_srgb,var(--ap-danger)_14%,transparent)]",
  info: "text-app-info bg-[color-mix(in_srgb,var(--ap-info)_14%,transparent)]",
  steel:
    "text-app-steel bg-[color-mix(in_srgb,var(--ap-steel)_14%,transparent)]",
  muted:
    "text-app-muted bg-[color-mix(in_srgb,var(--ap-muted)_14%,transparent)]",
};

export default function AnnouncementsPage() {
  const role = useAuthStore((s) => s.user?.role);
  const isManager = role === "manager";
  const isResident = role === "resident";
  const { data: dashboard } = useResidentDashboardQuery({
    enabled: isResident,
  });
  const canLoadAnnouncements = isManager || dashboard?.hasUnit === true;
  const { data: announcements = [] } = useAnnouncementsQuery({
    enabled: canLoadAnnouncements,
  });
  const [composerOpen, setComposerOpen] = useState(false);
  const isEmpty = announcements.length === 0;

  if (isResident && dashboard && !dashboard.hasUnit) {
    return (
      <div className="sk-page max-w-[820px]">
        <NoUnitNotice />
      </div>
    );
  }

  return (
    <div className="sk-page flex max-w-[820px] flex-col gap-3.5">
      {!isEmpty ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[16px] font-bold text-app-fg">اطلاعیه‌ها</h1>
            <p className="mt-0.5 text-[12.5px] text-app-muted">
              {faNumber(announcements.length)} اطلاعیه منتشرشده
            </p>
          </div>
          {isManager ? (
            <AppButton variant="gold" onClick={() => setComposerOpen(true)}>
              <AppIcon name="add" className="size-[19px]" />
              انتشار اطلاعیه
            </AppButton>
          ) : null}
        </div>
      ) : null}

      {isEmpty ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-app-border bg-app-surface px-6 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-app-surface2 text-app-muted">
            <AppIcon name="campaign" className="size-7" />
          </div>
          <div className="text-[15px] font-bold text-app-fg">
            اطلاعیه‌ای تا الان منتشر نشده
          </div>
          <p className="max-w-[360px] text-[13px] leading-7 text-app-muted">
            {isManager
              ? "اولین اطلاعیه ساختمان را بنویسید تا برای همه ساکنین نمایش داده شود."
              : "وقتی مدیر ساختمان اطلاعیه‌ای منتشر کند، اینجا نمایش داده می‌شود."}
          </p>
          {isManager ? (
            <AppButton
              variant="gold"
              className="mt-1"
              onClick={() => setComposerOpen(true)}
            >
              <AppIcon name="add" className="size-[19px]" />
              انتشار اطلاعیه
            </AppButton>
          ) : null}
        </div>
      ) : (
        announcements.map((a) => (
          <div
            key={a.id}
            className={cn(
              "rounded-[14px] border border-r-[3px] border-app-border bg-app-surface p-5 shadow-[var(--ap-shadow-sm)]",
              ACCENT[a.color],
            )}
          >
            <div className="mb-2.5 flex items-center gap-3">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-[10px]",
                  CHIP[a.color],
                )}
              >
                <AppIcon name={a.icon} className="size-5" />
              </div>
              <span className="flex-1 text-[15px] font-bold">{a.title}</span>
              <span className="text-xs text-app-muted">{a.date}</span>
            </div>
            <p className="text-[13.5px] leading-[2] text-app-muted">{a.body}</p>
          </div>
        ))
      )}

      {isManager ? (
        <AnnouncementModal
          open={composerOpen}
          onClose={() => setComposerOpen(false)}
        />
      ) : null}
    </div>
  );
}
