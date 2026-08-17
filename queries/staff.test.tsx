import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getStaff } from "@/api/staff";

import { useStaffQuery } from "./staff";
import { createWrapper } from "./test-utils";

vi.mock("@/api/staff", () => ({
  staffKeys: { list: ["staff", "list"] },
  getStaff: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useStaffQuery", () => {
  it("fetches active staff", async () => {
    vi.mocked(getStaff).mockResolvedValue([]);
    const { result } = renderHook(() => useStaffQuery(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getStaff).toHaveBeenCalledTimes(1);
  });
});
