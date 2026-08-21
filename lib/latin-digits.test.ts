import { describe, expect, it } from "vitest";

import {
  hasNonLatinDigits,
  LATIN_DIGITS_ONLY_MESSAGE,
  normalizeToLatinDigits,
  positiveAmountString,
  positiveWholeAmountString,
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
  const schema = positiveAmountString();

  it("accepts Persian digit amounts", () => {
    const result = schema.safeParse("۱۵۰۰۰۰");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("150000");
  });

  it("accepts a fractional amount", () => {
    // Invoices issued before charges were split in whole toman still carry
    // fractions, and the resident has to be able to pay the exact figure.
    const result = schema.safeParse("33333.33");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("33333.33");
  });

  it("accepts a fraction typed with Persian digits and separator", () => {
    const result = schema.safeParse("۳۳۳۳۳٫۳۳");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("33333.33");
  });

  it("rejects more precision than a currency can carry", () => {
    expect(schema.safeParse("100.005").success).toBe(false);
  });

  it("still rejects a non-numeric amount", () => {
    expect(schema.safeParse("abc").success).toBe(false);
    expect(schema.safeParse("100.").success).toBe(false);
  });

  it("still rejects zero", () => {
    expect(schema.safeParse("0").success).toBe(false);
    expect(schema.safeParse("0.00").success).toBe(false);
  });
});

describe("positiveWholeAmountString", () => {
  const schema = positiveWholeAmountString();

  it("accepts a whole amount", () => {
    expect(schema.safeParse("۱۵۰۰۰۰").success).toBe(true);
  });

  it("refuses a fraction, which the backend would reject anyway", () => {
    // A charge line must stay whole so the split across units has no
    // fractions; accepting 100.50 here would only earn a 400.
    expect(schema.safeParse("100.50").success).toBe(false);
  });

  it("still refuses zero and non-numeric input", () => {
    expect(schema.safeParse("0").success).toBe(false);
    expect(schema.safeParse("abc").success).toBe(false);
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
