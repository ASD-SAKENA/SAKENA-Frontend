import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { requestKeys } from "@/api/requests";
import {
  completeRequest,
  createRequest,
  getManagerRequests,
  getResidentRequests,
  startRequestProgress,
} from "@/api/requests";
import { taskKeys } from "@/api/tasks";

import {
  useCompleteRequestMutation,
  useCreateRequestMutation,
  useManagerRequestsQuery,
  useResidentRequestsQuery,
  useStartProgressMutation,
} from "./requests";
import { createTestQueryClient, createWrapper } from "./test-utils";

vi.mock("@/api/requests", () => ({
  requestKeys: {
    all: ["requests"],
    resident: ["requests", "resident"],
    manager: ["requests", "manager"],
    categories: ["requests", "categories"],
  },
  getResidentRequests: vi.fn(),
  getManagerRequests: vi.fn(),
  getRequestCategories: vi.fn(),
  createRequest: vi.fn(),
  approveRequest: vi.fn(),
  rejectRequest: vi.fn(),
  assignRequest: vi.fn(),
  startRequestProgress: vi.fn(),
  completeRequest: vi.fn(),
}));
vi.mock("@/api/tasks", () => ({
  taskKeys: { all: ["tasks"] },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useResidentRequestsQuery / useManagerRequestsQuery", () => {
  it("fetch through their respective api functions", async () => {
    vi.mocked(getResidentRequests).mockResolvedValue([]);
    vi.mocked(getManagerRequests).mockResolvedValue([]);

    const { result: resident } = renderHook(() => useResidentRequestsQuery(), {
      wrapper: createWrapper(),
    });
    const { result: manager } = renderHook(() => useManagerRequestsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(resident.current.isSuccess).toBe(true));
    await waitFor(() => expect(manager.current.isSuccess).toBe(true));
  });
});

describe("useCreateRequestMutation", () => {
  it("invalidates all requests on success", async () => {
    vi.mocked(createRequest).mockResolvedValue({ id: "r1" });
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useCreateRequestMutation(), {
      wrapper: createWrapper(client),
    });
    result.current.mutate({
      categoryGroup: "FACILITIES",
      subCategory: "ELEVATOR",
      title: "t",
      description: "d",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: requestKeys.all });
  });
});

describe("useStartProgressMutation / useCompleteRequestMutation", () => {
  it("also invalidate the staff task list, since it derives from the same requests", async () => {
    vi.mocked(startRequestProgress).mockResolvedValue(undefined);
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useStartProgressMutation(), {
      wrapper: createWrapper(client),
    });
    result.current.mutate("req-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: requestKeys.all });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: taskKeys.all });
  });

  it("useCompleteRequestMutation passes id/report/cost through to the api call", async () => {
    vi.mocked(completeRequest).mockResolvedValue(undefined);
    const { result } = renderHook(() => useCompleteRequestMutation(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({ id: "req-1", report: "گزارش", cost: 50000 });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(completeRequest).toHaveBeenCalledWith("req-1", "گزارش", 50000);
  });
});
