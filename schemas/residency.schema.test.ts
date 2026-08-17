import { describe, expect, it } from "vitest";

import { TENANCY_LABELS } from "./residency.schema";

describe("TENANCY_LABELS", () => {
  it("has a Persian label for every tenancy type", () => {
    expect(Object.keys(TENANCY_LABELS)).toEqual([
      "OWNER_OCCUPIER",
      "TENANT",
      "COMMERCIAL",
    ]);
  });
});
