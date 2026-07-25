import { LOCALE } from "@/app/config";

import { toFaDigits } from "@/lib/persian-number";

/** «۱۴:۳۲» — the time a message was sent, in the app locale. */
export function messageTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Day separator label — «امروز», «دیروز» or the full date. */
export function messageDayLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / dayMs,
  );

  if (diffDays === 0) return "امروز";
  if (diffDays === 1) return "دیروز";
  return date.toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** «۰:۰۷» clock format for a voice note length. */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${toFaDigits(minutes)}:${toFaDigits(String(rest).padStart(2, "0"))}`;
}

/** Initial shown in a sender's avatar chip. */
export function senderInitial(name: string): string {
  return name.trim().charAt(0) || "؟";
}
