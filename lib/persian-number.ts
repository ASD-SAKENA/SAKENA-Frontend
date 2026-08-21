const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Convert ASCII digits in a value to Persian digits. */
export function toFaDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]!);
}

/** Convert Persian / Arabic-Indic digits to ASCII (0-9). */
export { normalizeToLatinDigits as toEnDigits } from "@/lib/latin-digits";

/**
 * Format a number as a grouped Persian-digit Toman amount (no currency word).
 *
 * Whole amounts show no decimals; a fractional one — an invoice issued before
 * charges were split in whole toman — shows exactly two, so the resident sees
 * the precise figure they owe rather than a rounded one.
 */
export function faNumber(value: number): string {
  const hasFraction = !Number.isInteger(value);
  return toFaDigits(
    value.toLocaleString("en-US", {
      minimumFractionDigits: hasFraction ? 2 : 0,
      maximumFractionDigits: 2,
    }),
  );
}

/** Format a number as "۱٬۲۳۴ تومان". */
export function formatToman(value: number): string {
  return `${faNumber(value)} تومان`;
}
