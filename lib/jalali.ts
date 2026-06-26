// Bidirectional Jalali <-> Gregorian conversion (jalaali-js algorithm, MIT)
// plus helpers for building a Persian month grid used by the streak calendar.
import { getTehranGregorianParts } from "@/lib/tehran-date";

const BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192,
  2262, 2326, 2364, 2394, 2456, 3178,
] as const;

const div = (a: number, b: number) => Math.trunc(a / b);
const mod = (a: number, b: number) => a - Math.trunc(a / b) * b;

type JalCal = { leap: number; gy: number; march: number };

function jalCal(jy: number): JalCal {
  const bl = BREAKS.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp: number = BREAKS[0];
  let jm = 0;
  let jump = 0;

  for (let i = 1; i < bl; i += 1) {
    jm = BREAKS[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }

  let n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;

  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;

  return { leap, gy, march };
}

function g2d(gy: number, gm: number, gd: number): number {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number): { gy: number; gm: number; gd: number } {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

export function toJalali(
  gy: number,
  gm: number,
  gd: number,
): { jy: number; jm: number; jd: number } {
  const jdn = g2d(gy, gm, gd);
  const gregYear = d2g(jdn).gy;
  let jy = gregYear - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gregYear, 3, r.march);
  let k = jdn - jdn1f;

  if (k >= 0) {
    if (k <= 185) {
      return { jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  return { jy, jm: 7 + div(k, 30), jd: mod(k, 30) + 1 };
}

export function toGregorian(
  jy: number,
  jm: number,
  jd: number,
): { gy: number; gm: number; gd: number } {
  return d2g(j2d(jy, jm, jd));
}

export function isLeapJalaliYear(jy: number): boolean {
  return jalCal(jy).leap === 0;
}

export function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaliYear(jy) ? 30 : 29;
}

export const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const;

// Persian week starts on Saturday.
export const JALALI_WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"] as const;

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;

export function toFaDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

function toIso(gy: number, gm: number, gd: number): string {
  const mm = String(gm).padStart(2, "0");
  const dd = String(gd).padStart(2, "0");
  return `${gy}-${mm}-${dd}`;
}

export function getTodayJalali(): { jy: number; jm: number; jd: number } {
  const now = new Date();
  return toJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/** Today in Jalali calendar using Asia/Tehran (aligns with streak server). */
export function getTodayJalaliInTehran(): {
  jy: number;
  jm: number;
  jd: number;
} {
  const { year, month, day } = getTehranGregorianParts();
  return toJalali(year, month, day);
}

export type JalaliDayCell = {
  jd: number;
  iso: string;
  /** Column index 0..6 where 0 = Saturday. */
  weekday: number;
};

/** Build the day cells of a Jalali month with their Gregorian ISO dates. */
export function buildJalaliMonthGrid(jy: number, jm: number): JalaliDayCell[] {
  const length = jalaliMonthLength(jy, jm);
  const cells: JalaliDayCell[] = [];
  for (let jd = 1; jd <= length; jd += 1) {
    const { gy, gm, gd } = toGregorian(jy, jm, jd);
    const jsDay = new Date(gy, gm - 1, gd).getDay(); // 0 = Sunday
    cells.push({ jd, iso: toIso(gy, gm, gd), weekday: (jsDay + 1) % 7 });
  }
  return cells;
}

/** Leading empty cells before day 1 so the grid aligns to the Saturday column. */
export function jalaliMonthLeadingBlanks(jy: number, jm: number): number {
  const { gy, gm, gd } = toGregorian(jy, jm, 1);
  const jsDay = new Date(gy, gm - 1, gd).getDay();
  return (jsDay + 1) % 7;
}

/** Gregorian "YYYY-MM" months (1 or 2) that overlap a Jalali month. */
export function overlappingGregorianMonths(jy: number, jm: number): string[] {
  const length = jalaliMonthLength(jy, jm);
  const first = toGregorian(jy, jm, 1);
  const last = toGregorian(jy, jm, length);
  const months = new Set<string>();
  months.add(`${first.gy}-${String(first.gm).padStart(2, "0")}`);
  months.add(`${last.gy}-${String(last.gm).padStart(2, "0")}`);
  return [...months];
}

export function addJalaliMonth(
  jy: number,
  jm: number,
  delta: number,
): { jy: number; jm: number } {
  const zeroBased = jm - 1 + delta;
  return { jy: jy + Math.floor(zeroBased / 12), jm: mod(zeroBased, 12) + 1 };
}
