import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getStaffHistory, getStaffSummary, getStaffTasks } from "@/api/tasks";

import {
  useStaffHistoryQuery,
  useStaffSummaryQuery,
  useStaffTasksQuery,
} from "./tasks";
import { createWrapper } from "./test-utils";

vi.mock("@/api/tasks", () => ({
  taskKeys: {
    staff: ["tasks", "staff"],
    summary: ["tasks", "summary"],
    history: ["tasks", "history"],
  },
  getStaffTasks: vi.fn(),
  getStaffSummary: vi.fn(),
  getStaffHistory: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("staff task queries", () => {
  it("useStaffTasksQuery fetches through getStaffTasks", async () => {
    vi.mocked(getStaffTasks).mockResolvedValue([]);
    const { result } = renderHook(() => useStaffTasksQuery(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getStaffTasks).toHaveBeenCalledTimes(1);
  });

  it("useStaffSummaryQuery fetches through getStaffSummary", async () => {
    vi.mocked(getStaffSummary).mockResolvedValue([]);
    const { result } = renderHook(() => useStaffSummaryQuery(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getStaffSummary).toHaveBeenCalledTimes(1);
  });

  it("useStaffHistoryQuery fetches through getStaffHistory", async () => {
    vi.mocked(getStaffHistory).mockResolvedValue([]);
    const { result } = renderHook(() => useStaffHistoryQuery(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getStaffHistory).toHaveBeenCalledTimes(1);
  });
});
