import Link from "next/link";

import { cn } from "@/lib/utils";

const brandButtonBase =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm no-underline transition-transform duration-200 active:scale-[.98]";

export const brandButtonVariant = {
  gold: cn(
    brandButtonBase,
    "bg-[linear-gradient(180deg,var(--sk-gold-light),var(--sk-gold))] font-bold text-[var(--sk-bg)] shadow-[0_10px_28px_color-mix(in_srgb,var(--sk-gold)_28%,transparent)] hover:brightness-105",
  ),
  outline: cn(
    brandButtonBase,
    "border border-[var(--sk-border-strong)] bg-[var(--sk-surface-raised)] font-semibold text-[var(--sk-text)] hover:border-[color-mix(in_srgb,var(--sk-gold)_50%,transparent)]",
  ),
} as const;

interface BrandLinkProps {
  href: string;
  variant?: keyof typeof brandButtonVariant;
  children: React.ReactNode;
  className?: string;
}

export function BrandLink({
  href,
  variant = "gold",
  children,
  className,
}: BrandLinkProps) {
  return (
    <Link href={href} className={cn(brandButtonVariant[variant], className)}>
      {children}
    </Link>
  );
}
