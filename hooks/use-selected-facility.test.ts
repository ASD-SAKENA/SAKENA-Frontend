import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSelectedFacility } from "./use-selected-facility";

import { useReserveStore } from "@/stores/reserve.store";

const { useFacilitiesQueryMock } = vi.hoisted(() => ({
  useFacilitiesQueryMock: vi.fn(),
}));

vi.mock("@/queries/reserve", () => ({
  useFacilitiesQuery: useFacilitiesQueryMock,
}));

const facilities = [
  { id: "f1", name: "استخر" },
  { id: "f2", name: "سالن ورزش" },
] as never[];

beforeEach(() => {
  useReserveStore.setState({ selFacilityId: null });
  useFacilitiesQueryMock.mockReset();
});

describe("useSelectedFacility", () => {
  it("returns null selected facility when the list is empty", () => {
    useFacilitiesQueryMock.mockReturnValue({ data: [] });
    const { result } = renderHook(() => useSelectedFacility());
    expect(result.current.selected).toBeNull();
  });

  it("defaults to the first facility when none is explicitly selected", () => {
    useFacilitiesQueryMock.mockReturnValue({ data: facilities });
    const { result } = renderHook(() => useSelectedFacility());
    expect(result.current.selected).toEqual(facilities[0]);
  });

  it("returns the explicitly selected facility when it still exists", () => {
    useReserveStore.setState({ selFacilityId: "f2" });
    useFacilitiesQueryMock.mockReturnValue({ data: facilities });
    const { result } = renderHook(() => useSelectedFacility());
    expect(result.current.selected).toEqual(facilities[1]);
  });

  it("falls back to the first facility when the selected one no longer exists", () => {
    useReserveStore.setState({ selFacilityId: "gone" });
    useFacilitiesQueryMock.mockReturnValue({ data: facilities });
    const { result } = renderHook(() => useSelectedFacility());
    expect(result.current.selected).toEqual(facilities[0]);
  });
});
