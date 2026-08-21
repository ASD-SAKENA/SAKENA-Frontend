import { describe, expect, it } from "vitest";

import {
  chargeItemSchema,
  chargePeriodSchema,
  invoicePaymentSchema,
} from "./billing.schema";

describe("chargePeriodSchema", () => {
  const valid = {
    buildingId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    title: "شارژ بهار",
    type: "MONTHLY" as const,
    startsOn: "2026-01-01",
    endsOn: "2026-02-01",
  };

  it("accepts a valid period with endsOn after startsOn", () => {
    expect(chargePeriodSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects endsOn before startsOn", () => {
    const result = chargePeriodSchema.safeParse({
      ...valid,
      startsOn: "2026-02-01",
      endsOn: "2026-01-01",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["endsOn"]);
    }
  });

  it("rejects a malformed date", () => {
    expect(
      chargePeriodSchema.safeParse({ ...valid, startsOn: "01/01/2026" })
        .success,
    ).toBe(false);
  });

  it("rejects a non-uuid buildingId", () => {
    expect(
      chargePeriodSchema.safeParse({ ...valid, buildingId: "not-a-uuid" })
        .success,
    ).toBe(false);
  });
});

describe("chargeItemSchema", () => {
  it("accepts a valid charge item", () => {
    const result = chargeItemSchema.safeParse({
      title: "شارژ نگهبانی",
      amount: "500000",
      kind: "RECURRING_CHARGE",
      allocation: "EQUAL",
      targetApartmentId: "",
    });
    expect(result.success).toBe(true);
  });

  it("requires the unit when the cost falls on a single one", () => {
    // The aggregate refuses a SPECIFIC_UNIT item with no target, so catching
    // it here turns a 400 into a message on the field that is wrong.
    const result = chargeItemSchema.safeParse({
      title: "تعمیر درب",
      amount: "300000",
      kind: "RECURRING_CHARGE",
      allocation: "SPECIFIC_UNIT",
      targetApartmentId: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a single-unit cost that names its unit", () => {
    const result = chargeItemSchema.safeParse({
      title: "تعمیر درب",
      amount: "300000",
      kind: "RECURRING_CHARGE",
      allocation: "SPECIFIC_UNIT",
      targetApartmentId: "apt-2",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a zero amount", () => {
    expect(
      chargeItemSchema.safeParse({
        title: "شارژ",
        amount: "0",
        kind: "RECURRING_CHARGE",
        allocation: "EQUAL",
      }).success,
    ).toBe(false);
  });

  it("rejects an unknown kind", () => {
    expect(
      chargeItemSchema.safeParse({
        title: "شارژ",
        amount: "100",
        kind: "UNKNOWN",
        allocation: "EQUAL",
      }).success,
    ).toBe(false);
  });
});

describe("invoicePaymentSchema", () => {
  it("accepts a positive numeric amount", () => {
    expect(invoicePaymentSchema.safeParse({ amount: "100000" }).success).toBe(
      true,
    );
  });

  it("rejects a non-numeric amount", () => {
    expect(invoicePaymentSchema.safeParse({ amount: "abc" }).success).toBe(
      false,
    );
  });
});
