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
});

describe("formatToman", () => {
  it("appends the toman suffix", () => {
    expect(formatToman(5000)).toBe("۵,۰۰۰ تومان");
  });
});
