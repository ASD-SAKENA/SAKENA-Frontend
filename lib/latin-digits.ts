import { z } from "zod";

export const NON_LATIN_DIGIT_RE = /[\u0660-\u0669\u06F0-\u06F9]/;

export const LATIN_DIGITS_ONLY_MESSAGE =
  "ارقام باید به صورت انگلیسی وارد شوند.";

export function hasNonLatinDigits(value: string): boolean {
  return NON_LATIN_DIGIT_RE.test(value);
}

/**
 * Convert Persian (۰-۹) and Arabic-Indic (٠-٩) digits to ASCII 0-9, and the
 * Arabic decimal separator (٫) to a plain dot — a Persian keyboard produces
 * it instead of ".", and an amount typed that way must still parse.
 */
export function normalizeToLatinDigits(value: string): string {
  return value
    .replace(/[\u06F0-\u06F9]/g, (char) => String(char.charCodeAt(0) - 0x06f0))
    .replace(/[\u0660-\u0669]/g, (char) => String(char.charCodeAt(0) - 0x0660))
    .replace(/\u066B/g, ".");
}

export function validateOtpAsciiDigits(otp: string): string | null {
  const normalizedOtp = normalizeToLatinDigits(otp);
  if (hasNonLatinDigits(normalizedOtp)) return LATIN_DIGITS_ONLY_MESSAGE;
  if (!/^\d+$/.test(normalizedOtp)) return LATIN_DIGITS_ONLY_MESSAGE;
  return null;
}

/** Digits-only string; Persian/Arabic-Indic digits are accepted. Input stays `string`. */
export function digitString(message: string) {
  return z
    .string()
    .transform((value) => normalizeToLatinDigits(value.trim()))
    .pipe(z.string().regex(/^\d+$/, message));
}

/** Optional digits (empty allowed). Input stays `string`. */
export function optionalDigitString(message: string) {
  return z
    .string()
    .transform((value) => normalizeToLatinDigits(value.trim()))
    .pipe(z.string().regex(/^\d*$/, message));
}

/**
 * Positive whole-toman amount as a string. Input stays `string`.
 *
 * Used where the backend requires an integral amount — a new charge line must
 * be whole so the split across units stays free of fractions.
 */
export function positiveWholeAmountString(
  message = "مبلغ باید عدد صحیح (تومان) باشد.",
  zeroMessage = "مبلغ باید بزرگ‌تر از صفر باشد.",
) {
  return z
    .string()
    .transform((value) => normalizeToLatinDigits(value.trim()))
    .pipe(
      z
        .string()
        .regex(/^\d+$/, message)
        .refine((value) => Number(value) > 0, zeroMessage),
    );
}

/**
 * Positive toman amount as a string. Input stays `string`.
 *
 * Up to two decimals are allowed: invoices issued before charges were split
 * in whole toman still carry fractions, and those residents have to be able
 * to pay the exact amount they owe.
 */
export function positiveAmountString(
  message = "مبلغ باید عدد (تومان) باشد.",
  zeroMessage = "مبلغ باید بزرگ‌تر از صفر باشد.",
  precisionMessage = "مبلغ حداکثر تا دو رقم اعشار مجاز است.",
) {
  return z
    .string()
    .transform((value) => normalizeToLatinDigits(value.trim()))
    .pipe(
      z
        .string()
        .regex(/^\d+(\.\d+)?$/, message)
        .refine(
          (value) => (value.split(".")[1]?.length ?? 0) <= 2,
          precisionMessage,
        )
        .refine((value) => Number(value) > 0, zeroMessage),
    );
}

/**
 * Coerce to number after normalizing Persian/Arabic-Indic digits.
 * Accepts string or number input (form number inputs often yield strings).
 */
export function latinCoercedNumber(message: string) {
  return z
    .union([z.string(), z.number()])
    .transform((value) =>
      typeof value === "string" ? normalizeToLatinDigits(value.trim()) : value,
    )
    .pipe(z.coerce.number({ message }));
}
