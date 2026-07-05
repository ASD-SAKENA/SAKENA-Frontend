import { cn } from "@/lib/utils";

import type { StatusColor } from "@/types/app.type";

import { AppIcon } from "./app-icon";

const ICON_COLOR: Record<StatusColor, string> = {
  gold: "text-app-gold",
  success: "text-app-success",
  warning: "text-app-warning",
  danger: "text-app-danger",
  info: "text-app-info",
  steel: "text-app-steel",
  muted: "text-app-muted",
};

export interface KpiCardProps {
  label: string;
  value: string;
  icon: string;
  color: StatusColor;
  /** Secondary line under the value. */
  sub?: string;
  /** Colored trend line (overrides `sub` styling color). */
  subColor?: StatusColor;
}

export function KpiCard({
  label,
  value,
  icon,
  color,
  sub,
  subColor,
}: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-app-border bg-app-surface p-[18px] shadow-[var(--ap-shadow-sm)]">
      <div className="flex items-start justify-between">
        <span className="text-[13px] text-app-muted">{label}</span>
        <AppIcon name={icon} className={cn("size-[22px]", ICON_COLOR[color])} />
      </div>
      <div className="mt-3 text-[24px] font-extrabold text-app-fg">{value}</div>
      {sub ? (
        <div
          className={cn(
            "mt-1.5 text-xs",
            subColor ? ICON_COLOR[subColor] : "text-app-muted",
          )}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
}
