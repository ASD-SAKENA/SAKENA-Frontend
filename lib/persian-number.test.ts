import { describe, expect, it } from "vitest";

import {
  faNumber,
  formatToman,
  toEnDigits,
  toFaDigits,
} from "./persian-number";

describe("toFaDigits", () => {
  it("converts ASCII digits to Persian digits", () => {
    expect(toFaDigits("0123456789")).toBe("۰۱۲۳۴۵۶۷۸۹");
  });

  it("accepts a number", () => {
    expect(toFaDigits(42)).toBe("۴۲");
  });

  it("leaves non-digit characters untouched", () => {
    expect(toFaDigits("a1b2")).toBe("a۱b۲");
  });
});

describe("toEnDigits", () => {
  it("converts Persian digits to ASCII", () => {
    expect(toEnDigits("۰۱۲۳۴۵۶۷۸۹")).toBe("0123456789");
  });
});

describe("faNumber", () => {
  it("groups thousands and converts digits to Persian", () => {
    expect(faNumber(1234567)).toBe("۱,۲۳۴,۵۶۷");
  });

  it("formats zero", () => {
    expect(faNumber(0)).toBe("۰");
  });

  it("shows two decimals for a fractional amount", () => {
    expect(faNumber(33333.33)).toBe("۳۳,۳۳۳.۳۳");
  });

  it("keeps a whole amount free of decimals", () => {
    expect(faNumber(33333)).toBe("۳۳,۳۳۳");
  });
});

describe("formatToman", () => {
  it("appends the toman suffix", () => {
    expect(formatToman(5000)).toBe("۵,۰۰۰ تومان");
  });
});
