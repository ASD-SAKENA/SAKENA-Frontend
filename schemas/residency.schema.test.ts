import { describe, expect, it } from "vitest";

import { residencySchema, TENANCY_LABELS } from "./residency.schema";

describe("residencySchema", () => {
  it("accepts a valid resident id and tenancy", () => {
    const result = residencySchema.safeParse({
      residentId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      tenancy: "TENANT",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a non-uuid resident id", () => {
    expect(
      residencySchema.safeParse({ residentId: "not-a-uuid", tenancy: "TENANT" })
        .success,
    ).toBe(false);
  });

  it("rejects an unknown tenancy type", () => {
    expect(
      residencySchema.safeParse({
        residentId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        tenancy: "UNKNOWN",
      }).success,
    ).toBe(false);
  });
});

describe("TENANCY_LABELS", () => {
  it("has a Persian label for every tenancy type", () => {
    expect(Object.keys(TENANCY_LABELS)).toEqual([
      "OWNER_OCCUPIER",
      "TENANT",
      "COMMERCIAL",
    ]);
  });
});
