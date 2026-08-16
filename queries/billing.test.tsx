import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { billingKeys } from "@/api/billing";
import {
  addChargeItem,
  createChargePeriod,
  getChargeItems,
} from "@/api/billing";

import {
  useAddChargeItemMutation,
  useChargeItemsQuery,
  useCreateChargePeriodMutation,
} from "./billing";
import { createTestQueryClient, createWrapper } from "./test-utils";

vi.mock("@/api/billing", () => ({
  billingKeys: {
    all: ["billing"],
    periods: (id?: string) => ["billing", "periods", id ?? ""],
    items: (id: string) => ["billing", "items", id],
    invoices: (id: string) => ["billing", "invoices", id],
    unitInvoices: (id: string) => ["billing", "unit-invoices", id],
  },
  getChargePeriods: vi.fn(),
  getChargeItems: vi.fn(),
  getPeriodInvoices: vi.fn(),
  getUnitInvoices: vi.fn(),
  createChargePeriod: vi.fn(),
  deleteChargePeriod: vi.fn(),
  addChargeItem: vi.fn(),
  removeChargeItem: vi.fn(),
  issueChargePeriod: vi.fn(),
  closeChargePeriod: vi.fn(),
  registerInvoicePayment: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useChargeItemsQuery", () => {
  it("is disabled while periodId is null", () => {
    const { result } = renderHook(() => useChargeItemsQuery(null), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(getChargeItems).not.toHaveBeenCalled();
  });

  it("fetches once a periodId is given", async () => {
    vi.mocked(getChargeItems).mockResolvedValue([]);
    const { result } = renderHook(() => useChargeItemsQuery("p1"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getChargeItems).toHaveBeenCalledWith("p1");
  });
});

describe("useCreateChargePeriodMutation", () => {
  it("invalidates the billing.all key on success", async () => {
    vi.mocked(createChargePeriod).mockResolvedValue({} as never);
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useCreateChargePeriodMutation(), {
      wrapper: createWrapper(client),
    });
    result.current.mutate({
      buildingId: "b1",
      title: "دوره",
      type: "MONTHLY",
      startsOn: "2026-01-01",
      endsOn: "2026-02-01",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: billingKeys.all });
  });
});

describe("useAddChargeItemMutation", () => {
  it("passes periodId/payload through to the api call", async () => {
    vi.mocked(addChargeItem).mockResolvedValue({} as never);
    const { result } = renderHook(() => useAddChargeItemMutation(), {
      wrapper: createWrapper(),
    });
    const payload = {
      title: "نگهبانی",
      amount: 500000,
      kind: "RECURRING_CHARGE" as const,
      allocation: "EQUAL" as const,
    };
    result.current.mutate({ periodId: "p1", payload });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(vi.mocked(addChargeItem).mock.calls[0]).toEqual(["p1", payload]);
  });
});
