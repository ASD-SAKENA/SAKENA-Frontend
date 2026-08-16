import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { unitKeys } from "@/api/units";
import {
  createBuilding,
  deleteApartment,
  getBuildings,
  getUnits,
} from "@/api/units";

import { createTestQueryClient, createWrapper } from "./test-utils";
import {
  useBuildingsQuery,
  useCreateBuildingMutation,
  useDeleteApartmentMutation,
  useUnitsQuery,
} from "./units";

vi.mock("@/api/units", () => ({
  unitKeys: {
    all: ["units"],
    list: (buildingId?: string) => ["units", "list", buildingId ?? ""],
    buildings: ["units", "buildings"],
  },
  getUnits: vi.fn(),
  getBuildings: vi.fn(),
  createApartment: vi.fn(),
  updateApartment: vi.fn(),
  deleteApartment: vi.fn(),
  createBuilding: vi.fn(),
  updateBuilding: vi.fn(),
  deleteBuilding: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useUnitsQuery / useBuildingsQuery", () => {
  it("fetch through their api functions", async () => {
    vi.mocked(getUnits).mockResolvedValue([]);
    vi.mocked(getBuildings).mockResolvedValue([]);

    const { result: units } = renderHook(() => useUnitsQuery("b1"), {
      wrapper: createWrapper(),
    });
    const { result: buildings } = renderHook(() => useBuildingsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(units.current.isSuccess).toBe(true));
    await waitFor(() => expect(buildings.current.isSuccess).toBe(true));
    expect(getUnits).toHaveBeenCalledWith("b1");
  });
});

describe("mutations invalidate the shared units.all key", () => {
  it("useDeleteApartmentMutation", async () => {
    vi.mocked(deleteApartment).mockResolvedValue(undefined);
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useDeleteApartmentMutation(), {
      wrapper: createWrapper(client),
    });
    result.current.mutate("apt-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: unitKeys.all });
  });

  it("useCreateBuildingMutation", async () => {
    vi.mocked(createBuilding).mockResolvedValue({
      id: "b1",
      name: "برج",
      address: "تهران",
      createdAt: "",
      updatedAt: "",
    });
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useCreateBuildingMutation(), {
      wrapper: createWrapper(client),
    });
    result.current.mutate({ name: "برج", address: "تهران" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: unitKeys.all });
  });
});
