import type { AccentKey } from "@/types/landing.type";

/**
 * Tailwind class strings per accent — full literals so the compiler keeps them.
 * Tint backgrounds use color-mix so we never hardcode rgba alongside the token.
 */
export const ACCENT_CHIP: Record<AccentKey, string> = {
  gold: "text-[var(--sk-gold)] bg-[color-mix(in_srgb,var(--sk-gold)_14%,transparent)]",
  blue: "text-[var(--sk-blue)] bg-[color-mix(in_srgb,var(--sk-blue)_14%,transparent)]",
  green:
    "text-[var(--sk-green)] bg-[color-mix(in_srgb,var(--sk-green)_14%,transparent)]",
  amber:
    "text-[var(--sk-amber)] bg-[color-mix(in_srgb,var(--sk-amber)_14%,transparent)]",
  slate:
    "text-[var(--sk-slate)] bg-[color-mix(in_srgb,var(--sk-slate)_14%,transparent)]",
  red: "text-[var(--sk-red)] bg-[color-mix(in_srgb,var(--sk-red)_14%,transparent)]",
};

export const ACCENT_TEXT: Record<AccentKey, string> = {
  gold: "text-[var(--sk-gold-light)]",
  blue: "text-[var(--sk-blue)]",
  green: "text-[var(--sk-green)]",
  amber: "text-[var(--sk-amber)]",
  slate: "text-[var(--sk-slate)]",
  red: "text-[var(--sk-red)]",
};
