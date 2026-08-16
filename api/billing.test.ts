import { beforeEach, describe, expect, it, vi } from "vitest";

import http from "@/services/http";

import {
  addChargeItem,
  closeChargePeriod,
  createChargePeriod,
  deleteChargePeriod,
  getChargeItems,
  getChargePeriods,
  getPeriodInvoices,
  getUnitInvoices,
  issueChargePeriod,
  registerInvoicePayment,
  removeChargeItem,
} from "./billing";

vi.mock("@/services/http", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(http.get).mockResolvedValue({ data: [] });
  vi.mocked(http.post).mockResolvedValue({ data: {} });
  vi.mocked(http.delete).mockResolvedValue({ data: {} });
});

describe("getChargePeriods", () => {
  it("omits the buildingId param when not given", async () => {
    await getChargePeriods();
    expect(http.get).toHaveBeenCalledWith("/charge-periods", {
      params: undefined,
    });
  });

  it("includes the buildingId param when given", async () => {
    await getChargePeriods("b1");
    expect(http.get).toHaveBeenCalledWith("/charge-periods", {
      params: { buildingId: "b1" },
    });
  });
});

describe("charge period lifecycle", () => {
  it("createChargePeriod posts to /charge-periods", async () => {
    const payload = {
      buildingId: "b1",
      title: "دوره بهار",
      type: "MONTHLY" as const,
      startsOn: "2026-01-01",
      endsOn: "2026-02-01",
    };
    await createChargePeriod(payload);
    expect(http.post).toHaveBeenCalledWith("/charge-periods", payload);
  });

  it("deleteChargePeriod deletes by id", async () => {
    await deleteChargePeriod("p1");
    expect(http.delete).toHaveBeenCalledWith("/charge-periods/p1");
  });

  it("issueChargePeriod posts to the issue sub-route", async () => {
    await issueChargePeriod("p1");
    expect(http.post).toHaveBeenCalledWith("/charge-periods/p1/issue");
  });

  it("closeChargePeriod posts to the close sub-route", async () => {
    await closeChargePeriod("p1");
    expect(http.post).toHaveBeenCalledWith("/charge-periods/p1/close");
  });
});

describe("charge items", () => {
  it("getChargeItems reads a period's items", async () => {
    await getChargeItems("p1");
    expect(http.get).toHaveBeenCalledWith("/charge-periods/p1/items");
  });

  it("addChargeItem posts a new item to the period", async () => {
    const payload = {
      title: "نگهبانی",
      amount: 500000,
      kind: "RECURRING_CHARGE" as const,
      allocation: "EQUAL" as const,
    };
    await addChargeItem("p1", payload);
    expect(http.post).toHaveBeenCalledWith("/charge-periods/p1/items", payload);
  });

  it("removeChargeItem deletes an item from the period", async () => {
    await removeChargeItem("p1", "item-1");
    expect(http.delete).toHaveBeenCalledWith("/charge-periods/p1/items/item-1");
  });
});

describe("invoices", () => {
  it("getPeriodInvoices reads all invoices of a period", async () => {
    await getPeriodInvoices("p1");
    expect(http.get).toHaveBeenCalledWith("/charge-periods/p1/invoices");
  });

  it("getUnitInvoices filters by apartmentId", async () => {
    await getUnitInvoices("apt-1");
    expect(http.get).toHaveBeenCalledWith("/invoices", {
      params: { apartmentId: "apt-1" },
    });
  });

  it("registerInvoicePayment posts the amount", async () => {
    await registerInvoicePayment("inv-1", 250000);
    expect(http.post).toHaveBeenCalledWith("/invoices/inv-1/payments", {
      amount: 250000,
    });
  });
});
