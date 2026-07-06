"use client";

import { AppIcon } from "@/components/app/app-icon";

import { useAnnouncementsQuery } from "@/queries/announcements";

import { cn } from "@/lib/utils";

import type { StatusColor } from "@/types/app.type";

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
  const { data: announcements = [] } = useAnnouncementsQuery();

  return (
    <div className="sk-page flex max-w-[820px] flex-col gap-3.5">
      {announcements.map((a) => (
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
      ))}
    </div>
  );
}
