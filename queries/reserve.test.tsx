import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { reserveKeys } from "@/api/reserve";
import { createBooking, getBookings, getFacilities } from "@/api/reserve";

import {
  useCreateBookingMutation,
  useFacilitiesQuery,
  useFacilityBookingsQuery,
} from "./reserve";
import { createTestQueryClient, createWrapper } from "./test-utils";

vi.mock("@/api/reserve", () => ({
  reserveKeys: {
    facilities: ["reserve", "facilities"],
    bookingsRoot: ["reserve", "bookings"],
    bookings: (id: string, week: number) => ["reserve", "bookings", id, week],
    myBookings: ["reserve", "bookings", "mine"],
  },
  getFacilities: vi.fn(),
  createFacility: vi.fn(),
  updateFacility: vi.fn(),
  deleteFacility: vi.fn(),
  getBookings: vi.fn(),
  getMyBookings: vi.fn(),
  createBooking: vi.fn(),
  cancelBooking: vi.fn(),
}));
vi.mock("@/queries/profile", () => ({
  useMyUserIdQuery: () => ({ data: "user-1" }),
}));

const rules = {
  startHour: 8,
  endHour: 22,
  slots: 28,
  closedDays: [],
  minSlots: 1,
  maxSlots: 4,
  maxAdvanceDays: 30,
  maxPerWeek: 0,
  hourlyPrice: 0,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useFacilitiesQuery", () => {
  it("fetches the facility list", async () => {
    vi.mocked(getFacilities).mockResolvedValue([]);
    const { result } = renderHook(() => useFacilitiesQuery(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getFacilities).toHaveBeenCalledTimes(1);
  });
});

describe("useFacilityBookingsQuery", () => {
  it("is disabled without a facilityId", () => {
    const { result } = renderHook(
      () => useFacilityBookingsQuery(null, 0, rules),
      { wrapper: createWrapper() },
    );
    expect(result.current.fetchStatus).toBe("idle");
    expect(getBookings).not.toHaveBeenCalled();
  });

  it("passes the current user id (from useMyUserIdQuery) to getBookings", async () => {
    vi.mocked(getBookings).mockResolvedValue([]);
    const { result } = renderHook(
      () => useFacilityBookingsQuery("f1", 0, rules),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getBookings).toHaveBeenCalledWith("f1", 0, rules, "user-1");
  });
});

describe("useCreateBookingMutation", () => {
  it("invalidates the bookings root (all facilities/weeks) on success", async () => {
    vi.mocked(createBooking).mockResolvedValue({ id: "bk1" });
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useCreateBookingMutation(), {
      wrapper: createWrapper(client),
    });
    result.current.mutate({
      facilityId: "f1",
      weekOffset: 0,
      day: 1,
      start: 4,
      dur: 2,
      startHour: 8,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(vi.mocked(createBooking).mock.calls[0]).toEqual([
      "f1",
      0,
      1,
      4,
      2,
      8,
    ]);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: reserveKeys.bookingsRoot,
    });
  });
});
