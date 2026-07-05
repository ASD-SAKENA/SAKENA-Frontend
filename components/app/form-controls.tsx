"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import { AppIcon } from "./app-icon";

interface FieldProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function AppField({ label, error, children, className }: FieldProps) {
  return (
    <div className={cn("mb-4", className)}>
      {label ? (
        <label className="mb-2 block text-[13px] font-medium text-app-fg">
          {label}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="mt-1.5 text-[12px] text-app-danger">{error}</p>
      ) : null}
    </div>
  );
}

const inputBase =
  "h-[46px] w-full rounded-[11px] border border-app-border bg-app-bg text-[14px] text-app-fg outline-none transition-[border-color,box-shadow] placeholder:text-app-muted focus:border-app-gold focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--ap-gold)_22%,transparent)]";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
}

export const AppInput = forwardRef<HTMLInputElement, InputProps>(
  function AppInput({ icon, className, ...props }, ref) {
    if (!icon) {
      return (
        <input
          ref={ref}
          className={cn(inputBase, "px-3.5 text-right", className)}
          {...props}
        />
      );
    }
    return (
      <div className="relative">
        <AppIcon
          name={icon}
          className="pointer-events-none absolute top-1/2 right-3.5 size-[19px] -translate-y-1/2 text-app-muted"
        />
        <input
          ref={ref}
          className={cn(inputBase, "pr-[42px] pl-3.5 text-right", className)}
          {...props}
        />
      </div>
    );
  },
);

export const AppTextarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function AppTextarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-24 w-full resize-none rounded-xl border border-app-border bg-app-bg px-3.5 py-3 text-right text-[13.5px] text-app-fg transition-[border-color,box-shadow] outline-none placeholder:text-app-muted focus:border-app-gold focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--ap-gold)_22%,transparent)]",
        className,
      )}
      {...props}
    />
  );
});
