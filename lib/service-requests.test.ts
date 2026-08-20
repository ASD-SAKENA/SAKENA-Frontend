import { describe, expect, it } from "vitest";

import type { ServiceRequestApiStatus } from "@/types/requests.api.type";

import {
  CATEGORY_GROUP_LABELS,
  REQUEST_STATUS_META,
  shortRequestId,
  statusGroupOf,
  subCategoryLabel,
} from "./service-requests";

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

describe("statusGroupOf", () => {
  it("keeps a request that still needs work out of «انجام‌شده»", () => {
    // COMPLETED means staff finished but the resident has not confirmed, so
    // treating it as done would let a manager pay out too early.
    expect(statusGroupOf("PENDING")).toBe("open");
    expect(statusGroupOf("APPROVED")).toBe("open");
    expect(statusGroupOf("ASSIGNED")).toBe("progress");
    expect(statusGroupOf("IN_PROGRESS")).toBe("progress");
    expect(statusGroupOf("COMPLETED")).toBe("progress");
  });

  it("counts only genuinely finished work as done", () => {
    expect(statusGroupOf("CONFIRMED")).toBe("done");
    expect(statusGroupOf("SETTLED")).toBe("done");
  });

  it("keeps a rejected request out of every other group", () => {
    // It used to fall through to "open", so a rejected request looked live.
    expect(statusGroupOf("REJECTED")).toBe("rejected");
  });

  it("groups every status the backend can return", () => {
    const all = Object.keys(REQUEST_STATUS_META) as ServiceRequestApiStatus[];

    all.forEach((status) => {
      expect(statusGroupOf(status)).toBeDefined();
    });
  });
});

describe("CATEGORY_GROUP_LABELS", () => {
  it("mirrors the backend's Persian category names", () => {
    expect(CATEGORY_GROUP_LABELS.FACILITIES).toBe("تاسیسات");
    expect(CATEGORY_GROUP_LABELS.GREEN_SPACE).toBe("فضای سبز");
  });
});
