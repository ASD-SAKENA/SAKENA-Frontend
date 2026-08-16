import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { residencyKeys } from "@/api/residency";
import {
  endResidency,
  getBuildingResidencies,
  getMyResidency,
  startResidency,
} from "@/api/residency";
import { unitKeys } from "@/api/units";

import {
  useBuildingResidenciesQuery,
  useEndResidencyMutation,
  useMyResidencyQuery,
  useStartResidencyMutation,
} from "./residency";
import { createTestQueryClient, createWrapper } from "./test-utils";

vi.mock("@/api/residency", () => ({
  residencyKeys: {
    all: ["residencies"],
    mine: ["residencies", "me"],
    byBuilding: (id: string | null) => ["residencies", "building", id ?? "all"],
  },
  getMyResidency: vi.fn(),
  getBuildingResidencies: vi.fn(),
  startResidency: vi.fn(),
  endResidency: vi.fn(),
}));
vi.mock("@/api/units", () => ({
  unitKeys: { all: ["units"] },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useBuildingResidenciesQuery", () => {
  it("always fetches (no enabled gate) - null means all buildings", async () => {
    vi.mocked(getBuildingResidencies).mockResolvedValue([]);
    const { result } = renderHook(() => useBuildingResidenciesQuery(null), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getBuildingResidencies).toHaveBeenCalledWith(null);
  });

  it("fetches a specific building's residencies", async () => {
    vi.mocked(getBuildingResidencies).mockResolvedValue([]);
    const { result } = renderHook(() => useBuildingResidenciesQuery("b1"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getBuildingResidencies).toHaveBeenCalledWith("b1");
  });
});

describe("useMyResidencyQuery", () => {
  it("fetches the signed-in resident's residency", async () => {
    vi.mocked(getMyResidency).mockResolvedValue(null);
    const { result } = renderHook(() => useMyResidencyQuery(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getMyResidency).toHaveBeenCalledTimes(1);
  });
});

describe("useStartResidencyMutation / useEndResidencyMutation", () => {
  it("invalidate both residencies and units caches (units table shows resident names)", async () => {
    vi.mocked(startResidency).mockResolvedValue({} as never);
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useStartResidencyMutation(), {
      wrapper: createWrapper(client),
    });
    result.current.mutate({
      apartmentId: "apt-1",
      payload: { residentId: "u1", tenancy: "TENANT" },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: residencyKeys.all });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: unitKeys.all });
  });

  it("useEndResidencyMutation calls endResidency with the apartment id", async () => {
    vi.mocked(endResidency).mockResolvedValue({} as never);
    const { result } = renderHook(() => useEndResidencyMutation(), {
      wrapper: createWrapper(),
    });
    result.current.mutate("apt-1");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(vi.mocked(endResidency).mock.calls[0]?.[0]).toBe("apt-1");
  });
});
