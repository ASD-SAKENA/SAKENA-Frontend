import { LOCALE } from "@/app/config";

import { toFaDigits } from "@/lib/persian-number";

import type { ApiDayOfWeek } from "@/types/reserve.api.type";
import type { FacilityRules } from "@/types/reserve.type";

/** Weekday order of the Persian week, indexed the way the grid is. */
export const API_WEEK_DAYS: ApiDayOfWeek[] = [
  "SATURDAY",
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
];

/** Minutes covered by one grid row. */
export const SLOT_MINUTES = 30;

/** Grid fallback (08:00 → 22:00) used until a facility's rules are known. */
export const DEFAULT_START_HOUR = 8;
export const DEFAULT_END_HOUR = 22;

/** Rules the backend applies by default to a facility with no policy set. */
export const DEFAULT_RULES: FacilityRules = {
  startHour: DEFAULT_START_HOUR,
  endHour: DEFAULT_END_HOUR,
  slots: (DEFAULT_END_HOUR - DEFAULT_START_HOUR) * 2,
  closedDays: [],
  minSlots: 1,
  maxSlots: 4,
  maxAdvanceDays: 30,
  maxPerWeek: 0,
  hourlyPrice: 0,
};

/** Saturday 00:00 (local time) of the week `weekOffset` weeks from now. */
export function weekStartDate(weekOffset: number): Date {
  const now = new Date();
  // JS getDay(): Sun=0 … Sat=6; the Persian week starts on Saturday.
  const daysSinceSaturday = (now.getDay() + 1) % 7;
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() - daysSinceSaturday + weekOffset * 7);
  return start;
}

/** Absolute time of a grid cell (weekday index + slot within the open hours). */
export function slotToDate(
  weekOffset: number,
  day: number,
  slot: number,
  startHour: number,
): Date {
  const date = weekStartDate(weekOffset);
  date.setDate(date.getDate() + day);
  date.setMinutes(startHour * 60 + slot * SLOT_MINUTES);
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
 * the range falls outside the visible week or the facility's open hours.
 */
export function rangeToGrid(
  weekOffset: number,
  startsAt: string,
  endsAt: string,
  rules: FacilityRules,
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
    (start.getTime() - midnight.getTime()) / 60_000 - rules.startHour * 60;
  const slot = Math.round(minutesFromStart / SLOT_MINUTES);
  const dur = Math.round(
    (end.getTime() - start.getTime()) / (SLOT_MINUTES * 60_000),
  );
  if (slot < 0 || slot >= rules.slots || dur < 1) return null;

  return { day, start: slot, dur: Math.min(dur, rules.slots - slot) };
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

/** hh:mm (Persian digits) for the start of slot `i` within the open hours. */
export function slotTime(i: number, startHour: number): string {
  const minutes = startHour * 60 + i * SLOT_MINUTES;
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  return `${toFaDigits(hh)}:${toFaDigits(mm)}`;
}

/**
 * Price of a slot of `dur` rows, mirroring the backend's hourly formula.
 * The hourly rate is per person, so a bigger party pays proportionally more.
 */
export function slotPrice(
  rules: FacilityRules,
  dur: number,
  partySize = 1,
): number {
  if (rules.hourlyPrice <= 0) return 0;
  return Math.round((rules.hourlyPrice * dur * SLOT_MINUTES * partySize) / 60);
}

/**
 * Whether a booking's session has already begun. The backend refuses to cancel
 * (and therefore to refund) from this moment on, so the UI hides the option.
 */
export function hasSessionStarted(startsAt: Date): boolean {
  return startsAt.getTime() <= Date.now();
}

/** Whether a grid cell lies in the past (a booking must start in the future). */
export function isPastSlot(
  weekOffset: number,
  day: number,
  slot: number,
  startHour: number,
): boolean {
  return slotToDate(weekOffset, day, slot, startHour).getTime() <= Date.now();
}

/** Whether a grid cell is further ahead than the facility allows. */
export function isBeyondAdvanceWindow(
  weekOffset: number,
  day: number,
  slot: number,
  rules: FacilityRules,
): boolean {
  const limit = Date.now() + rules.maxAdvanceDays * 24 * 60 * 60 * 1000;
  return slotToDate(weekOffset, day, slot, rules.startHour).getTime() > limit;
}

/**
 * The most people booked at any single half-hour row of a day.
 *
 * Mirrors the backend's `SlotOccupancy`: capacity applies to a moment, so a
 * booking only occupies the rows it actually covers.
 */
export function peopleAtSlot(
  bookings: { day: number; start: number; dur: number; partySize: number }[],
  day: number,
  slot: number,
): number {
  return bookings
    .filter((b) => b.day === day && b.start <= slot && slot < b.start + b.dur)
    .reduce((sum, b) => sum + b.partySize, 0);
}

/** Peak occupancy across the rows a candidate booking would cover. */
export function peakPeopleInRange(
  bookings: { day: number; start: number; dur: number; partySize: number }[],
  day: number,
  start: number,
  dur: number,
): number {
  let peak = 0;
  for (let slot = start; slot < start + dur; slot++) {
    peak = Math.max(peak, peopleAtSlot(bookings, day, slot));
  }
  return peak;
}
