import { describe, expect, it } from "vitest";

import { shortRequestId, subCategoryLabel } from "./service-requests";

describe("subCategoryLabel", () => {
  it("returns the Persian label for a known sub-category", () => {
    expect(subCategoryLabel("ELECTRICAL")).toBe("برق");
  });

  it("falls back to the raw value for an unknown sub-category", () => {
    expect(subCategoryLabel("SOMETHING_NEW")).toBe("SOMETHING_NEW");
  });
});

describe("shortRequestId", () => {
  it("slices the first 8 characters of a UUID", () => {
    expect(shortRequestId("a1b2c3d4-e5f6-7890-abcd-ef1234567890")).toBe(
      "a1b2c3d4",
    );
  });

  it("returns the whole string when shorter than 8 characters", () => {
    expect(shortRequestId("abc")).toBe("abc");
  });
});
