import { describe, expect, it } from "vitest";

import type { UnitInvoiceApiResponse } from "@/types/billing.api.type";

import {
  invoiceDueDateKey,
  invoiceDueUrgency,
  sortInvoicesByDueDate,
} from "./billing";

function invoice(
  partial: Partial<UnitInvoiceApiResponse> & Pick<UnitInvoiceApiResponse, "id">,
): UnitInvoiceApiResponse {
  return {
    periodId: "p1",
    periodTitle: "شارژ",
    startsOn: "2026-08-01",
    endsOn: "2026-08-31",
    apartmentId: "a1",
    unitNumber: "1",
    residentUsername: null,
    amount: 100,
    paidAmount: 0,
    remaining: 100,
    status: "UNPAID",
    issuedAt: "2026-08-01T00:00:00Z",
    ...partial,
  };
}

describe("invoiceDueDateKey", () => {
  it("keeps LocalDate strings as-is", () => {
    expect(invoiceDueDateKey("2026-08-21")).toBe("2026-08-21");
  });
});

describe("invoiceDueUrgency", () => {
  const today = new Date("2026-08-21T10:00:00");

  it("marks past due dates as overdue", () => {
    expect(invoiceDueUrgency("2026-08-20", today)).toBe("overdue");
  });

  it("marks today and the next few days as due soon", () => {
    expect(invoiceDueUrgency("2026-08-21", today)).toBe("due_soon");
    expect(invoiceDueUrgency("2026-08-24", today)).toBe("due_soon");
  });

  it("marks farther dates as upcoming", () => {
    expect(invoiceDueUrgency("2026-08-25", today)).toBe("upcoming");
  });

  it("returns none when there is no due date", () => {
    expect(invoiceDueUrgency(null, today)).toBe("none");
  });
});

describe("sortInvoicesByDueDate", () => {
  it("puts overdue and earlier due dates first", () => {
    const sorted = sortInvoicesByDueDate([
      invoice({ id: "later", endsOn: "2026-09-10" }),
      invoice({ id: "overdue", endsOn: "2026-08-01" }),
      invoice({ id: "soon", endsOn: "2026-08-22" }),
      invoice({ id: "nodue", endsOn: null }),
    ]);
    expect(sorted.map((item) => item.id)).toEqual([
      "overdue",
      "soon",
      "later",
      "nodue",
    ]);
  });
});
