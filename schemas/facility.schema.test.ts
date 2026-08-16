import { describe, expect, it } from "vitest";

import { facilitySchema } from "./facility.schema";

describe("facilitySchema", () => {
  const valid = {
    name: "استخر مجتمع",
    icon: "pool",
    capacity: "20",
    opensAtHour: "8",
    closesAtHour: "22",
    closedDays: [5],
    minDurationMinutes: "30",
    maxDurationMinutes: "120",
    maxAdvanceDays: "14",
    maxPerResidentPerWeek: "2",
    hourlyPrice: "50000",
  };

  it("accepts a fully valid facility", () => {
    expect(facilitySchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a capacity of 0", () => {
    expect(facilitySchema.safeParse({ ...valid, capacity: "0" }).success).toBe(
      false,
    );
  });

  it("rejects closesAtHour not after opensAtHour", () => {
    const result = facilitySchema.safeParse({
      ...valid,
      opensAtHour: "10",
      closesAtHour: "10",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path[0] === "closesAtHour"),
      ).toBe(true);
    }
  });

  it("rejects maxDurationMinutes below minDurationMinutes", () => {
    const result = facilitySchema.safeParse({
      ...valid,
      minDurationMinutes: "60",
      maxDurationMinutes: "30",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path[0] === "maxDurationMinutes"),
      ).toBe(true);
    }
  });

  it("rejects closing every day of the week", () => {
    const result = facilitySchema.safeParse({
      ...valid,
      closedDays: [0, 1, 2, 3, 4, 5, 6],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "closedDays")).toBe(
        true,
      );
    }
  });

  it("rejects an opensAtHour above 23", () => {
    expect(
      facilitySchema.safeParse({ ...valid, opensAtHour: "24" }).success,
    ).toBe(false);
  });

  it("rejects a minDurationMinutes below 15", () => {
    expect(
      facilitySchema.safeParse({ ...valid, minDurationMinutes: "10" }).success,
    ).toBe(false);
  });
});
