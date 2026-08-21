import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_RULES,
  hasSessionStarted,
  isBeyondAdvanceWindow,
  isPastSlot,
  peakPeopleInRange,
  peopleAtSlot,
  rangeToGrid,
  SLOT_MINUTES,
  slotPrice,
  slotTime,
  slotToDate,
  weekLabel,
  weekRange,
  weekStartDate,
} from "./reserve-time";

// 2026-03-05 is a Thursday; the Persian week starts on Saturday, so the
// visible week should start 2026-02-28 (verified: both fixed calendar dates).
const THURSDAY_NOON = new Date(2026, 2, 5, 12, 0, 0);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(THURSDAY_NOON);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("weekStartDate", () => {
  it("finds the most recent Saturday for the current week", () => {
    const start = weekStartDate(0);
    expect(start.getFullYear()).toBe(2026);
    expect(start.getMonth()).toBe(1); // February
    expect(start.getDate()).toBe(28);
    expect(start.getDay()).toBe(6); // Saturday
  });

  it("shifts by whole weeks for a non-zero offset", () => {
    const nextWeek = weekStartDate(1);
    const thisWeek = weekStartDate(0);
    const diffDays =
      (nextWeek.getTime() - thisWeek.getTime()) / (24 * 60 * 60 * 1000);
    expect(diffDays).toBe(7);
  });
});

describe("weekRange", () => {
  it("spans exactly 7 days", () => {
    const { from, to } = weekRange(0);
    const diffDays =
      (new Date(to).getTime() - new Date(from).getTime()) /
      (24 * 60 * 60 * 1000);
    expect(diffDays).toBe(7);
  });
});

describe("slotToDate", () => {
  it("places a slot at the configured start hour on the given day", () => {
    const date = slotToDate(0, 0, 0, 8);
    expect(date.getDate()).toBe(28); // Saturday, week start
    expect(date.getHours()).toBe(8);
    expect(date.getMinutes()).toBe(0);
  });

  it("advances by SLOT_MINUTES per slot index", () => {
    const date = slotToDate(0, 0, 2, 8);
    expect(date.getHours()).toBe(9);
    expect(date.getMinutes()).toBe(0);
  });
});

describe("slotTime", () => {
  it("formats the start hour with Persian digits", () => {
    expect(slotTime(0, 8)).toBe("۰۸:۰۰");
  });

  it("advances minutes across slot indices", () => {
    expect(slotTime(2, 8)).toBe("۰۹:۰۰");
  });
});

describe("slotPrice", () => {
  it("is free when the facility has no hourly price", () => {
    expect(slotPrice({ ...DEFAULT_RULES, hourlyPrice: 0 }, 2)).toBe(0);
  });

  it("prices a 1-hour (2-slot) booking", () => {
    const rules = { ...DEFAULT_RULES, hourlyPrice: 100000 };
    expect(slotPrice(rules, 2)).toBe(100000);
  });

  it("prices a half-hour (1-slot) booking", () => {
    const rules = { ...DEFAULT_RULES, hourlyPrice: 100000 };
    expect(slotPrice(rules, 1)).toBe(50000);
  });

  it("charges the hourly rate per person, so a bigger party pays more", () => {
    const rules = { ...DEFAULT_RULES, hourlyPrice: 100000 };
    expect(slotPrice(rules, 2, 3)).toBe(300000);
  });

  it("stays free for a whole party when the facility has no hourly price", () => {
    expect(slotPrice({ ...DEFAULT_RULES, hourlyPrice: 0 }, 2, 5)).toBe(0);
  });
});

describe("peopleAtSlot / peakPeopleInRange", () => {
  // 08:00-09:00 (rows 0-1) for 10 people, 09:00-10:00 (rows 2-3) for 6.
  const bookings = [
    { day: 1, start: 0, dur: 2, partySize: 10 },
    { day: 1, start: 2, dur: 2, partySize: 6 },
  ];

  it("counts only the bookings covering that row", () => {
    expect(peopleAtSlot(bookings, 1, 0)).toBe(10);
    expect(peopleAtSlot(bookings, 1, 2)).toBe(6);
  });

  it("ignores another day", () => {
    expect(peopleAtSlot(bookings, 2, 0)).toBe(0);
  });

  it("does not add up back-to-back bookings", () => {
    // The bug: an 08:00 booking used to consume the 09:00 slot's capacity.
    expect(peakPeopleInRange(bookings, 1, 0, 4)).toBe(10);
  });

  it("adds up bookings that genuinely share a row", () => {
    const overlapping = [
      { day: 1, start: 0, dur: 4, partySize: 4 },
      { day: 1, start: 2, dur: 2, partySize: 6 },
    ];

    expect(peakPeopleInRange(overlapping, 1, 0, 4)).toBe(10);
  });

  it("is zero for a range no booking touches", () => {
    expect(peakPeopleInRange(bookings, 1, 6, 2)).toBe(0);
  });
});

describe("hasSessionStarted", () => {
  it("is true once the start time has passed", () => {
    expect(hasSessionStarted(new Date(2026, 2, 5, 11, 0, 0))).toBe(true);
  });

  it("is false while the session is still ahead", () => {
    expect(hasSessionStarted(new Date(2026, 2, 5, 13, 0, 0))).toBe(false);
  });
});

describe("isPastSlot", () => {
  it("is true for a slot earlier today than the current time", () => {
    // "now" is Thursday noon; 08:00 the same week-start Saturday is in the past.
    expect(isPastSlot(0, 0, 0, 8)).toBe(true);
  });

  it("is false for a slot next week", () => {
    expect(isPastSlot(1, 0, 0, 8)).toBe(false);
  });
});

describe("isBeyondAdvanceWindow", () => {
  it("is false within the facility's advance-booking window", () => {
    const rules = { ...DEFAULT_RULES, maxAdvanceDays: 30 };
    expect(isBeyondAdvanceWindow(0, 0, 0, rules)).toBe(false);
  });

  it("is true beyond the facility's advance-booking window", () => {
    const rules = { ...DEFAULT_RULES, maxAdvanceDays: 1 };
    expect(isBeyondAdvanceWindow(4, 0, 0, rules)).toBe(true);
  });
});

describe("rangeToGrid", () => {
  it("maps a booking range back onto the same grid cell it came from", () => {
    const start = slotToDate(0, 1, 4, DEFAULT_RULES.startHour);
    const end = slotToDate(0, 1, 6, DEFAULT_RULES.startHour);
    const cell = rangeToGrid(
      0,
      start.toISOString(),
      end.toISOString(),
      DEFAULT_RULES,
    );
    expect(cell).toEqual({ day: 1, start: 4, dur: 2 });
  });

  it("returns null for a range outside the visible week", () => {
    const start = slotToDate(3, 0, 0, DEFAULT_RULES.startHour);
    const end = new Date(start.getTime() + SLOT_MINUTES * 60_000);
    expect(
      rangeToGrid(0, start.toISOString(), end.toISOString(), DEFAULT_RULES),
    ).toBeNull();
  });
});

describe("weekLabel", () => {
  it("returns a non-empty range label", () => {
    const label = weekLabel(0);
    expect(label).toContain(" – ");
    expect(label.length).toBeGreaterThan(3);
  });
});
