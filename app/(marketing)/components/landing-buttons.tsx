import Link from "next/link";

import { cn } from "@/lib/utils";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const baseButton =
  "inline-flex items-center gap-2 rounded-xl font-bold no-underline transition-transform duration-200 active:scale-[.98]";

export function GoldButton({ href, children, className }: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        baseButton,
        "bg-[linear-gradient(180deg,var(--sk-gold-light),var(--sk-gold))] text-[var(--sk-bg)] shadow-[0_10px_28px_color-mix(in_srgb,var(--sk-gold)_28%,transparent)] hover:brightness-105",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function OutlineButton({ href, children, className }: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        baseButton,
        "border border-[var(--sk-border-strong)] bg-[var(--sk-surface-raised)] font-semibold text-[var(--sk-text)] hover:border-[color-mix(in_srgb,var(--sk-gold)_50%,transparent)]",
        className,
      )}
    >
      {children}
    </Link>
  );
}
