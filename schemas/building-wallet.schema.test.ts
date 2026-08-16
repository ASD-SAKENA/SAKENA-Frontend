import { describe, expect, it } from "vitest";

import { buildingTransactionSchema } from "./building-wallet.schema";

describe("buildingTransactionSchema", () => {
  const valid = {
    direction: "CREDIT" as const,
    category: "CHARGE_COLLECTION" as const,
    amount: "500000",
    description: "دریافت شارژ اسفندماه",
  };

  it("accepts a valid transaction", () => {
    expect(buildingTransactionSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an unknown direction", () => {
    expect(
      buildingTransactionSchema.safeParse({ ...valid, direction: "OTHER" })
        .success,
    ).toBe(false);
  });

  it("rejects an unknown category", () => {
    expect(
      buildingTransactionSchema.safeParse({ ...valid, category: "OTHER" })
        .success,
    ).toBe(false);
  });

  it("rejects a zero amount", () => {
    expect(
      buildingTransactionSchema.safeParse({ ...valid, amount: "0" }).success,
    ).toBe(false);
  });

  it("rejects a description shorter than 3 characters", () => {
    expect(
      buildingTransactionSchema.safeParse({ ...valid, description: "ab" })
        .success,
    ).toBe(false);
  });
});
