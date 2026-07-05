import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  /** Rendered on the opposite side of the title (e.g. a link or button). */
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function SectionCard({
  title,
  action,
  children,
  className,
  bodyClassName,
}: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-app-border bg-app-surface shadow-[var(--ap-shadow-sm)]",
        className,
      )}
    >
      {title || action ? (
        <div className="flex items-center justify-between gap-3 px-[22px] pt-[20px]">
          {title ? (
            <div className="text-[15.5px] font-bold text-app-fg">{title}</div>
          ) : (
            <span />
          )}
          {action}
        </div>
      ) : null}
      <div className={cn("p-[22px]", bodyClassName)}>{children}</div>
    </div>
  );
}
