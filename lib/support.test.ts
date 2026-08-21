import { describe, expect, it } from "vitest";

import type {
  TicketCategoryApi,
  TicketStatusApi,
} from "@/types/support.api.type";

import {
  raiserLabel,
  TICKET_CATEGORY_META,
  TICKET_STATUS_META,
} from "./support";

describe("TICKET_STATUS_META", () => {
  it("labels every backend status", () => {
    const statuses: TicketStatusApi[] = [
      "AWAITING_REPLY",
      "IN_PROGRESS",
      "ANSWERED",
    ];
    for (const status of statuses) {
      expect(TICKET_STATUS_META[status].label).toBeTruthy();
    }
  });

  it("uses the wording the feature was specified with", () => {
    expect(TICKET_STATUS_META.AWAITING_REPLY.label).toBe("در انتظار پاسخ");
    expect(TICKET_STATUS_META.IN_PROGRESS.label).toBe("در حال پاسخ");
    expect(TICKET_STATUS_META.ANSWERED.label).toBe("اتمام پاسخ");
  });
});

describe("TICKET_CATEGORY_META", () => {
  it("labels every backend category", () => {
    const categories: TicketCategoryApi[] = [
      "COMPLAINT",
      "CRITICISM",
      "SUGGESTION",
    ];
    for (const category of categories) {
      expect(TICKET_CATEGORY_META[category].label).toBeTruthy();
      expect(TICKET_CATEGORY_META[category].icon).toBeTruthy();
    }
  });
});

describe("raiserLabel", () => {
  it("names the resident and their unit", () => {
    expect(raiserLabel("سارا", "12")).toBe("سارا · واحد 12");
  });

  it("falls back to the name alone when no unit is assigned", () => {
    expect(raiserLabel("سارا", null)).toBe("سارا");
  });

  it("never invents an identity for an anonymous ticket", () => {
    // The backend withholds the name, so the UI must say so rather than
    // render an empty or misleading label.
    expect(raiserLabel(null, null)).toBe("ساکن ناشناس");
    expect(raiserLabel(null, "12")).toBe("ساکن ناشناس");
  });
});
