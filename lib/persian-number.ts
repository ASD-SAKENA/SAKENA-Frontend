const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Convert ASCII digits in a value to Persian digits. */
export function toFaDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

/** Format a number as a grouped Persian-digit Toman amount (no currency word). */
export function faNumber(value: number): string {
  return toFaDigits(value.toLocaleString("en-US"));
}

/** Format a number as "۱٬۲۳۴ تومان". */
export function formatToman(value: number): string {
  return `${faNumber(value)} تومان`;
}
