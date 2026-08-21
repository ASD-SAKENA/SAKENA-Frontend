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

/**
 * An amount as it should be typed into a payment field.
 *
 * Truncating here made a fractional debt unpayable: a remaining balance of
 * 0.84 became "0", which then failed the greater-than-zero rule. Toman is
 * stored to two decimals, so at most two are kept and a whole amount stays
 * free of a pointless ".00".
 */
export function toAmountInput(value: number): string {
  // Round before formatting: toFixed alone reads 100.005 as slightly less than
  // it is (binary floating point) and would round it down to 100.00.
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

/**
 * Whether a payment exceeds what is owed, compared in whole cents.
 *
 * A raw `>` is one floating-point ULP away from breaking: when the remaining
 * balance carries a long tail (0.6666…), the amount shown to the user rounds
 * up to 0.67, and the naive check rejects a payment the UI itself filled in.
 */
export function exceedsAmount(payment: number, owed: number): boolean {
  return Math.round(payment * 100) > Math.round(owed * 100);
}
