import { describe, expect, it } from "vitest";

import { formatFaDate, formatHMS } from "./format-date";

describe("formatHMS", () => {
  it("pads single digits with a leading zero", () => {
    expect(formatHMS(65)).toBe("00:01:05");
  });

  it("formats hours, minutes and seconds", () => {
    expect(formatHMS(3661)).toBe("01:01:01");
  });

  it("formats zero", () => {
    expect(formatHMS(0)).toBe("00:00:00");
  });
});

describe("formatFaDate", () => {
  it("returns an empty string for null/undefined", () => {
    expect(formatFaDate(null)).toBe("");
    expect(formatFaDate(undefined)).toBe("");
  });

  it("returns an empty string for an invalid date", () => {
    expect(formatFaDate("not-a-date")).toBe("");
  });

  it("formats a valid ISO date as a Jalali date with Persian digits", () => {
    // 2026-03-05 (Gregorian) is 1404-12-14 (Jalali).
    expect(formatFaDate("2026-03-05T10:00:00Z")).toBe("۱۴۰۴/۱۲/۱۴");
  });
});
