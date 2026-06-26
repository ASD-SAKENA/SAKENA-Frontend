import Image from "next/image";

import { cn } from "@/lib/utils";

interface Props {
  /** Large glyph above the title, e.g. "۴۰۴" or an icon. */
  badge?: React.ReactNode;
  title: string;
  description?: string;
  /** Action buttons / links. */
  children?: React.ReactNode;
  className?: string;
}

export function StatusScreen({
  badge,
  title,
  description,
  children,
  className,
}: Props) {
  return (
    <main
      dir="rtl"
      className={cn(
        "relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[var(--sk-bg)] px-6 text-center text-[var(--sk-text)] antialiased",
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[680px] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,color-mix(in_srgb,var(--sk-gold)_12%,transparent)_0%,transparent_70%)]" />

      <div className="relative flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="size-12 overflow-hidden rounded-xl bg-[var(--sk-bg)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--sk-gold)_35%,transparent)]">
            <Image
              src="/sakena-mark.jpg"
              alt="ساکنا"
              width={48}
              height={48}
              className="size-full object-cover"
            />
          </div>
          <div className="text-start leading-tight">
            <div className="text-lg font-extrabold tracking-wide">ساکِنا</div>
            <div className="text-[10px] tracking-widest text-[var(--sk-text-muted)]">
              SAKENA
            </div>
          </div>
        </div>

        {badge ? (
          <div className="bg-[linear-gradient(120deg,var(--sk-gold-light),var(--sk-gold))] bg-clip-text text-7xl font-black text-transparent tabular-nums">
            {badge}
          </div>
        ) : null}

        <h1 className="text-2xl font-extrabold">{title}</h1>

        {description ? (
          <p className="max-w-md text-sm leading-[2] text-[var(--sk-text-muted)]">
            {description}
          </p>
        ) : null}

        {children ? (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            {children}
          </div>
        ) : null}
      </div>
    </main>
  );
}
