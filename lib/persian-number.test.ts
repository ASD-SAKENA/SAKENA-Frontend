import { describe, expect, it } from "vitest";

import {
  exceedsAmount,
  faNumber,
  formatToman,
  toAmountInput,
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

describe("toAmountInput", () => {
  it("keeps a whole amount clean", () => {
    expect(toAmountInput(850000)).toBe("850000");
  });

  it("keeps the fraction of a small debt", () => {
    // The bug: truncating turned 0.84 into "0", which then failed the
    // greater-than-zero rule and made the debt unpayable.
    expect(toAmountInput(0.84)).toBe("0.84");
  });

  it("keeps the fraction of a large debt", () => {
    expect(toAmountInput(33333.33)).toBe("33333.33");
  });

  it("does not carry more precision than the currency stores", () => {
    expect(toAmountInput(100.005)).toBe("100.01");
  });
});

describe("exceedsAmount", () => {
  it("accepts paying exactly what is owed", () => {
    expect(exceedsAmount(0.84, 0.84)).toBe(false);
    expect(exceedsAmount(850000, 850000)).toBe(false);
  });

  it("accepts the rounded amount the UI fills in for a long-tailed balance", () => {
    // 2/3 renders as 0.67; a raw `>` would reject the very value the
    // "pay full amount" button just wrote into the field.
    expect(exceedsAmount(0.67, 2 / 3)).toBe(false);
  });

  it("still rejects paying more than is owed", () => {
    expect(exceedsAmount(0.85, 0.84)).toBe(true);
    expect(exceedsAmount(1000, 850)).toBe(true);
  });

  it("accepts paying less than is owed", () => {
    expect(exceedsAmount(0.5, 0.84)).toBe(false);
  });
});
