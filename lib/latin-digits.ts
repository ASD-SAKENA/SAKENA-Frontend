export const NON_LATIN_DIGIT_RE = /[\u0660-\u0669\u06F0-\u06F9]/;

export const LATIN_DIGITS_ONLY_MESSAGE =
  "ارقام باید به صورت انگلیسی وارد شوند.";

export function hasNonLatinDigits(value: string): boolean {
  return NON_LATIN_DIGIT_RE.test(value);
}

export function normalizeToLatinDigits(value: string): string {
  return value
    .replace(/[\u06F0-\u06F9]/g, (char) => String(char.charCodeAt(0) - 0x06f0))
    .replace(/[\u0660-\u0669]/g, (char) => String(char.charCodeAt(0) - 0x0660));
}

export function validateOtpAsciiDigits(otp: string): string | null {
  const normalizedOtp = normalizeToLatinDigits(otp);
  if (hasNonLatinDigits(normalizedOtp)) return LATIN_DIGITS_ONLY_MESSAGE;
  if (!/^\d+$/.test(normalizedOtp)) return LATIN_DIGITS_ONLY_MESSAGE;
  return null;
}
