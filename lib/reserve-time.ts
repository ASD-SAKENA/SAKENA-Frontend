import { LOCALE } from "@/app/config";

/** Half-hour slots rendered on the weekly grid (08:00 → 22:00). */
export const SLOTS = 28;
export const START_HOUR = 8;

/** Saturday 00:00 (local time) of the week `weekOffset` weeks from now. */
export function weekStartDate(weekOffset: number): Date {
  const now = new Date();
  // JS getDay(): Sun=0 … Sat=6; the Persian week starts on Saturday.
  const daysSinceSaturday = (now.getDay() + 1) % 7;
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() - daysSinceSaturday + weekOffset * 7);
  return start;
}

/** Absolute time of a grid cell (weekday index + half-hour slot). */
export function slotToDate(
  weekOffset: number,
  day: number,
  slot: number,
): Date {
  const date = weekStartDate(weekOffset);
  date.setDate(date.getDate() + day);
  date.setMinutes(START_HOUR * 60 + slot * 30);
  return date;
}

/** [from, to) ISO window covering the visible week. */
export function weekRange(weekOffset: number): { from: string; to: string } {
  const from = weekStartDate(weekOffset);
  const to = new Date(from);
  to.setDate(to.getDate() + 7);
  return { from: from.toISOString(), to: to.toISOString() };
}

/**
 * Maps an absolute booking range back onto the week grid. Returns null when
 * the range falls outside the visible week or the 08–22 slot window.
 */
export function rangeToGrid(
  weekOffset: number,
  startsAt: string,
  endsAt: string,
): { day: number; start: number; dur: number } | null {
  const weekStart = weekStartDate(weekOffset);
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  const dayMs = 24 * 60 * 60 * 1000;
  const day = Math.floor((start.getTime() - weekStart.getTime()) / dayMs);
  if (day < 0 || day > 6) return null;

  const midnight = new Date(weekStart);
  midnight.setDate(midnight.getDate() + day);
  const minutesFromStart =
    (start.getTime() - midnight.getTime()) / 60_000 - START_HOUR * 60;
  const slot = Math.round(minutesFromStart / 30);
  const dur = Math.round((end.getTime() - start.getTime()) / (30 * 60_000));
  if (slot < 0 || slot >= SLOTS || dur < 1) return null;

  return { day, start: slot, dur: Math.min(dur, SLOTS - slot) };
}

/** «۱۴ تیر – ۲۰ تیر» style label for the visible week. */
export function weekLabel(weekOffset: number): string {
  const start = weekStartDate(weekOffset);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString(LOCALE, { day: "numeric", month: "long" });
  return `${fmt(start)} – ${fmt(end)}`;
}
