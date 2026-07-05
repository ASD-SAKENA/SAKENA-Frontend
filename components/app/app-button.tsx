"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type Variant = "gold" | "outline" | "ghost";

const VARIANT: Record<Variant, string> = {
  gold: "bg-app-gold text-app-gold-fg font-bold hover:brightness-[1.06] disabled:cursor-not-allowed disabled:opacity-50",
  outline:
    "border border-app-border bg-transparent text-app-fg font-semibold hover:border-app-gold",
  ghost: "bg-transparent text-app-gold font-semibold hover:bg-app-surface2",
};

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const AppButton = forwardRef<HTMLButtonElement, Props>(
  function AppButton(
    { variant = "gold", className, type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm transition-[filter,background,border-color] active:scale-[.99]",
          VARIANT[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
