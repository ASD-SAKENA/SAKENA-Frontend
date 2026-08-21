import { describe, expect, it } from "vitest";

import {
  hasNonLatinDigits,
  LATIN_DIGITS_ONLY_MESSAGE,
  normalizeToLatinDigits,
  positiveAmountString,
  validateOtpAsciiDigits,
} from "./latin-digits";

describe("hasNonLatinDigits", () => {
  it("detects Persian digits", () => {
    expect(hasNonLatinDigits("۱۲۳")).toBe(true);
  });

  it("detects Arabic-Indic digits", () => {
    expect(hasNonLatinDigits("١٢٣")).toBe(true);
  });

  it("returns false for ASCII digits", () => {
    expect(hasNonLatinDigits("123")).toBe(false);
  });
});

describe("normalizeToLatinDigits", () => {
  it("converts Persian digits to ASCII", () => {
    expect(normalizeToLatinDigits("۱۲۳۴")).toBe("1234");
  });

  it("converts Arabic-Indic digits to ASCII", () => {
    expect(normalizeToLatinDigits("١٢٣٤")).toBe("1234");
  });

  it("leaves ASCII digits untouched", () => {
    expect(normalizeToLatinDigits("1234")).toBe("1234");
  });

  it("converts mixed text with Persian digits", () => {
    expect(normalizeToLatinDigits("مبلغ ۱۵۰۰۰۰ تومان")).toBe(
      "مبلغ 150000 تومان",
    );
  });
});

describe("positiveAmountString", () => {
  it("accepts Persian digit amounts", () => {
    const schema = positiveAmountString();
    const result = schema.safeParse("۱۵۰۰۰۰");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("150000");
  });
});

describe("validateOtpAsciiDigits", () => {
  it("accepts a plain numeric OTP", () => {
    expect(validateOtpAsciiDigits("123456")).toBeNull();
  });

  it("accepts Persian digits (normalizes before validating)", () => {
    expect(validateOtpAsciiDigits("۱۲۳۴۵۶")).toBeNull();
  });

  it("rejects a non-numeric OTP", () => {
    expect(validateOtpAsciiDigits("12a456")).toBe(LATIN_DIGITS_ONLY_MESSAGE);
  });
});
