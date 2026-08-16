import { describe, expect, it } from "vitest";

import {
  addJalaliMonth,
  buildJalaliMonthGrid,
  isLeapJalaliYear,
  jalaliMonthLeadingBlanks,
  jalaliMonthLength,
  overlappingGregorianMonths,
  toGregorian,
  toJalali,
} from "./jalali";

describe("toJalali / toGregorian", () => {
  it("converts Jalali new year (Nowruz) 1403 to Gregorian", () => {
    expect(toGregorian(1403, 1, 1)).toEqual({ gy: 2024, gm: 3, gd: 20 });
  });

  it("converts the same Gregorian date back to Jalali", () => {
    expect(toJalali(2024, 3, 20)).toEqual({ jy: 1403, jm: 1, jd: 1 });
  });

  it("round-trips a range of dates through both directions", () => {
    for (let day = 1; day <= 31; day += 5) {
      const g = toGregorian(1403, 6, day);
      const back = toJalali(g.gy, g.gm, g.gd);
      expect(back).toEqual({ jy: 1403, jm: 6, jd: day });
    }
  });
});

describe("isLeapJalaliYear", () => {
  it("1403 is a leap year", () => {
    expect(isLeapJalaliYear(1403)).toBe(true);
  });

  it("1404 is not a leap year", () => {
    expect(isLeapJalaliYear(1404)).toBe(false);
  });
});

describe("jalaliMonthLength", () => {
  it("the first 6 months are always 31 days", () => {
    expect(jalaliMonthLength(1404, 1)).toBe(31);
    expect(jalaliMonthLength(1404, 6)).toBe(31);
  });

  it("months 7-11 are always 30 days", () => {
    expect(jalaliMonthLength(1404, 7)).toBe(30);
    expect(jalaliMonthLength(1404, 11)).toBe(30);
  });

  it("Esfand (12) is 30 days in a leap year, 29 otherwise", () => {
    expect(jalaliMonthLength(1403, 12)).toBe(30);
    expect(jalaliMonthLength(1404, 12)).toBe(29);
  });
});

describe("addJalaliMonth", () => {
  it("advances within the same year", () => {
    expect(addJalaliMonth(1403, 6, 2)).toEqual({ jy: 1403, jm: 8 });
  });

  it("rolls forward into the next year", () => {
    expect(addJalaliMonth(1403, 12, 1)).toEqual({ jy: 1404, jm: 1 });
  });

  it("rolls backward into the previous year without landing on month 0", () => {
    expect(addJalaliMonth(1403, 1, -1)).toEqual({ jy: 1402, jm: 12 });
  });

  it("handles a delta spanning more than a year", () => {
    expect(addJalaliMonth(1403, 1, -13)).toEqual({ jy: 1401, jm: 12 });
  });
});

describe("buildJalaliMonthGrid", () => {
  it("builds one cell per day of the month", () => {
    const grid = buildJalaliMonthGrid(1404, 1);
    expect(grid).toHaveLength(31);
    expect(grid[0]).toEqual({
      jd: 1,
      iso: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      weekday: expect.any(Number),
    });
  });

  it("shortens Esfand to 29 days in a non-leap year", () => {
    expect(buildJalaliMonthGrid(1404, 12)).toHaveLength(29);
  });
});

describe("jalaliMonthLeadingBlanks", () => {
  it("returns a value in the 0-6 range", () => {
    const blanks = jalaliMonthLeadingBlanks(1404, 1);
    expect(blanks).toBeGreaterThanOrEqual(0);
    expect(blanks).toBeLessThanOrEqual(6);
  });
});

describe("overlappingGregorianMonths", () => {
  it("returns the one or two Gregorian YYYY-MM months a Jalali month spans", () => {
    expect(overlappingGregorianMonths(1403, 1)).toEqual(["2024-03", "2024-04"]);
  });
});
