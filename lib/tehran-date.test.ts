import { describe, expect, it } from "vitest";

import {
  getTehranDateKey,
  getTehranGregorianParts,
  getTehranPollSlot,
  getTehranTodayIso,
} from "./tehran-date";

describe("getTehranGregorianParts", () => {
  it("reads a fixed instant in Asia/Tehran (UTC+3:30)", () => {
    // 2026-03-05T21:00:00Z -> 2026-03-06 00:30 in Tehran.
    expect(getTehranGregorianParts(new Date("2026-03-05T21:00:00Z"))).toEqual(
      { year: 2026, month: 3, day: 6, hour: 0 },
    );
  });
});

describe("getTehranTodayIso", () => {
  it("formats as YYYY-MM-DD", () => {
    expect(getTehranTodayIso(new Date("2026-03-05T10:00:00Z"))).toBe(
      "2026-03-05",
    );
  });

  it("rolls over to the next Tehran day near midnight UTC", () => {
    expect(getTehranTodayIso(new Date("2026-03-05T21:00:00Z"))).toBe(
      "2026-03-06",
    );
  });
});

describe("getTehranDateKey", () => {
  it("is an alias for getTehranTodayIso", () => {
    const date = new Date("2026-03-05T10:00:00Z");
    expect(getTehranDateKey(date)).toBe(getTehranTodayIso(date));
  });
});

describe("getTehranPollSlot", () => {
  it("rounds down to the nearest 3-hour slot", () => {
    // 10:00 UTC -> 13:30 Tehran -> floor(13/3)*3 = 12
    expect(getTehranPollSlot(new Date("2026-03-05T10:00:00Z"))).toBe("12:00");
  });

  it("returns the first slot of the day at Tehran midnight", () => {
    // 20:30 UTC -> 00:00 Tehran
    expect(getTehranPollSlot(new Date("2026-03-05T20:30:00Z"))).toBe("00:00");
  });
});
