import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import http from "@/services/http";

import { DEFAULT_RULES, slotToDate } from "@/lib/reserve-time";

import {
  cancelBooking,
  createBooking,
  createFacility,
  deleteFacility,
  getBookings,
  getFacilities,
  getMyBookings,
  updateFacility,
} from "./reserve";

vi.mock("@/services/http", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const rawFacility = {
  id: "f1",
  name: "استخر",
  icon: "pool",
  capacity: 10,
  rules: {
    opensAt: "08:00",
    closesAt: "22:00",
    closedDays: ["FRIDAY"] as const,
    minDurationMinutes: 30,
    maxDurationMinutes: 120,
    maxAdvanceDays: 14,
    maxPerResidentPerWeek: 3,
    hourlyPrice: 50000,
  },
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 2, 5, 12, 0, 0)); // Thursday noon
});

afterEach(() => {
  vi.useRealTimers();
});

describe("getFacilities / toFacility mapping", () => {
  it("converts the backend's HH:mm rules into grid-hour rules", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [rawFacility] });
    const [facility] = await getFacilities();

    expect(http.get).toHaveBeenCalledWith("/facilities");
    expect(facility.rules.startHour).toBe(8);
    expect(facility.rules.endHour).toBe(22);
    expect(facility.rules.slots).toBe(28); // (22-8)h * 2 slots/h
    expect(facility.rules.closedDays).toEqual([6]); // FRIDAY -> index 6
  });

  it("falls back to DEFAULT_RULES when a facility has no rules", async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: [{ ...rawFacility, rules: null }],
    });
    const [facility] = await getFacilities();
    expect(facility.rules).toEqual(DEFAULT_RULES);
  });

  it("falls back to a default icon when the backend sends none", async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: [{ ...rawFacility, icon: null }],
    });
    const [facility] = await getFacilities();
    expect(facility.icon).toBe("pool");
  });
});

describe("facility mutations", () => {
  it("createFacility posts and maps the response", async () => {
    vi.mocked(http.post).mockResolvedValue({ data: rawFacility });
    const facility = await createFacility({ name: "استخر" });
    expect(http.post).toHaveBeenCalledWith("/facilities", { name: "استخر" });
    expect(facility.id).toBe("f1");
  });

  it("updateFacility puts to the facility's route", async () => {
    vi.mocked(http.put).mockResolvedValue({ data: rawFacility });
    await updateFacility("f1", { name: "استخر جدید" });
    expect(http.put).toHaveBeenCalledWith("/facilities/f1", {
      name: "استخر جدید",
    });
  });

  it("deleteFacility deletes by id", async () => {
    vi.mocked(http.delete).mockResolvedValue({ data: {} });
    await deleteFacility("f1");
    expect(http.delete).toHaveBeenCalledWith("/facilities/f1");
  });
});

describe("getBookings", () => {
  it("projects a booking within the visible week onto the grid, flagging 'mine'", async () => {
    const start = slotToDate(0, 1, 4, DEFAULT_RULES.startHour);
    const end = slotToDate(0, 1, 6, DEFAULT_RULES.startHour);
    vi.mocked(http.get).mockResolvedValue({
      data: [
        {
          id: "bk1",
          facilityId: "f1",
          bookedBy: "user-1",
          startsAt: start.toISOString(),
          endsAt: end.toISOString(),
        },
      ],
    });

    const bookings = await getBookings("f1", 0, DEFAULT_RULES, "user-1");

    expect(bookings).toEqual([
      { id: "bk1", day: 1, start: 4, dur: 2, mine: true },
    ]);
  });

  it("marks another resident's booking as not mine", async () => {
    const start = slotToDate(0, 1, 4, DEFAULT_RULES.startHour);
    const end = slotToDate(0, 1, 6, DEFAULT_RULES.startHour);
    vi.mocked(http.get).mockResolvedValue({
      data: [
        {
          id: "bk1",
          facilityId: "f1",
          bookedBy: "someone-else",
          startsAt: start.toISOString(),
          endsAt: end.toISOString(),
        },
      ],
    });

    const [booking] = await getBookings("f1", 0, DEFAULT_RULES, "user-1");
    expect(booking.mine).toBe(false);
  });

  it("drops bookings that fall outside the requested week", async () => {
    const start = slotToDate(3, 1, 4, DEFAULT_RULES.startHour);
    const end = slotToDate(3, 1, 6, DEFAULT_RULES.startHour);
    vi.mocked(http.get).mockResolvedValue({
      data: [
        {
          id: "bk1",
          facilityId: "f1",
          bookedBy: "user-1",
          startsAt: start.toISOString(),
          endsAt: end.toISOString(),
        },
      ],
    });

    const bookings = await getBookings("f1", 0, DEFAULT_RULES, "user-1");
    expect(bookings).toEqual([]);
  });
});

describe("getMyBookings", () => {
  it("sorts upcoming bookings chronologically", async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: [
        {
          id: "later",
          facilityId: "f1",
          facilityName: "استخر",
          facilityIcon: null,
          startsAt: "2026-03-10T10:00:00Z",
          endsAt: "2026-03-10T11:00:00Z",
          price: 50000,
        },
        {
          id: "sooner",
          facilityId: "f1",
          facilityName: "استخر",
          facilityIcon: "pool",
          startsAt: "2026-03-06T10:00:00Z",
          endsAt: "2026-03-06T11:00:00Z",
          price: 50000,
        },
      ],
    });

    const bookings = await getMyBookings();
    expect(bookings.map((b) => b.id)).toEqual(["sooner", "later"]);
    expect(bookings[0].startsAt).toBeInstanceOf(Date);
  });
});

describe("createBooking", () => {
  it("computes the start/end ISO range from the grid position", async () => {
    vi.mocked(http.post).mockResolvedValue({ data: { id: "bk1" } });
    const result = await createBooking("f1", 0, 1, 4, 2, 8);

    expect(http.post).toHaveBeenCalledWith(
      "/facilities/f1/bookings",
      expect.objectContaining({
        startsAt: expect.any(String),
        endsAt: expect.any(String),
      }),
    );
    const [, body] = vi.mocked(http.post).mock.calls[0] as [
      string,
      { startsAt: string; endsAt: string },
    ];
    expect(new Date(body.endsAt).getTime()).toBeGreaterThan(
      new Date(body.startsAt).getTime(),
    );
    expect(result).toEqual({ id: "bk1" });
  });
});

describe("cancelBooking", () => {
  it("deletes the booking under its facility", async () => {
    vi.mocked(http.delete).mockResolvedValue({ data: {} });
    await cancelBooking("f1", "bk1");
    expect(http.delete).toHaveBeenCalledWith("/facilities/f1/bookings/bk1");
  });
});
