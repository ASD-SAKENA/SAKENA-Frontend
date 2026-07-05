import { cn } from "@/lib/utils";

import type { StatusColor } from "@/types/app.type";

const COLOR: Record<StatusColor, string> = {
  gold: "text-app-gold bg-[color-mix(in_srgb,var(--ap-gold)_15%,transparent)]",
  success:
    "text-app-success bg-[color-mix(in_srgb,var(--ap-success)_15%,transparent)]",
  warning:
    "text-app-warning bg-[color-mix(in_srgb,var(--ap-warning)_15%,transparent)]",
  danger:
    "text-app-danger bg-[color-mix(in_srgb,var(--ap-danger)_15%,transparent)]",
  info: "text-app-info bg-[color-mix(in_srgb,var(--ap-info)_15%,transparent)]",
  steel:
    "text-app-steel bg-[color-mix(in_srgb,var(--ap-steel)_15%,transparent)]",
  muted:
    "text-app-muted bg-[color-mix(in_srgb,var(--ap-muted)_15%,transparent)]",
};

interface Props {
  color: StatusColor;
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ color, children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold whitespace-nowrap",
        COLOR[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
