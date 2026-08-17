import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getManagerDashboard, getResidentDashboard } from "@/api/dashboard";

import {
  useManagerDashboardQuery,
  useResidentDashboardQuery,
} from "./dashboard";
import { createWrapper } from "./test-utils";

vi.mock("@/api/dashboard", () => ({
  dashboardKeys: {
    resident: ["dashboard", "resident"],
    manager: ["dashboard", "manager"],
  },
  getResidentDashboard: vi.fn(),
  getManagerDashboard: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useResidentDashboardQuery", () => {
  it("fetches the resident dashboard", async () => {
    vi.mocked(getResidentDashboard).mockResolvedValue({
      kpis: [],
      unitInfo: [],
      charge: {
        title: "",
        amount: 0,
        dueLabel: "",
        progressPct: 0,
        walletBalance: 0,
      },
      hasUnit: false,
    });
    const { result } = renderHook(() => useResidentDashboardQuery(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getResidentDashboard).toHaveBeenCalledTimes(1);
  });
});

describe("useManagerDashboardQuery", () => {
  it("fetches the manager dashboard", async () => {
    vi.mocked(getManagerDashboard).mockResolvedValue({
      kpis: [],
      chartNote: "",
      chart: [],
      breakdown: [],
    });
    const { result } = renderHook(() => useManagerDashboardQuery(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getManagerDashboard).toHaveBeenCalledTimes(1);
  });
});
