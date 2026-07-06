import type { Booking, Facility, FacilityKey } from "@/types/reserve.type";

export const reserveKeys = {
  facilities: ["reserve", "facilities"] as const,
  bookings: (facility: FacilityKey) =>
    ["reserve", "bookings", facility] as const,
};

export const FACILITIES: Facility[] = [
  { key: "سالن ورزش", label: "سالن ورزش", icon: "fitness_center" },
  { key: "استخر", label: "استخر", icon: "pool" },
  { key: "سالن همایش", label: "سالن همایش", icon: "meeting_room" },
  { key: "آلاچیق", label: "آلاچیق", icon: "deck" },
];

/** Pre-seeded bookings per facility (design bookingData). */
const BASE_BOOKINGS: Record<FacilityKey, Booking[]> = {
  "سالن ورزش": [
    { day: 0, start: 2, dur: 4, who: "مهندس رضایی" },
    { day: 1, start: 18, dur: 3, who: "آقای نیکزاد" },
    { day: 3, start: 24, dur: 4, who: "شرکت آرمان" },
    { day: 5, start: 6, dur: 2, who: "خانم موسوی" },
  ],
  استخر: [
    { day: 0, start: 4, dur: 2, who: "خانم کاظمی" },
    { day: 2, start: 20, dur: 2, who: "آقای نیکزاد" },
    { day: 4, start: 22, dur: 4, who: "مهندس رضایی" },
  ],
  "سالن همایش": [
    { day: 2, start: 8, dur: 6, who: "هیئت مدیره" },
    { day: 6, start: 18, dur: 8, who: "مراسم ساکنین" },
  ],
  آلاچیق: [{ day: 5, start: 20, dur: 4, who: "خانواده احمدی" }],
};

export async function getFacilities(): Promise<Facility[]> {
  // Mock: the real call will be `http.get<Facility[]>("/facilities/")`.
  return FACILITIES;
}

export async function getBaseBookings(
  facility: FacilityKey,
): Promise<Booking[]> {
  // Mock: the real call will be
  // `http.get<Booking[]>("/facilities/bookings/", { params: { facility } })`.
  return BASE_BOOKINGS[facility] ?? [];
}

/** Synchronous accessor used by the store for conflict checks (static mock). */
export function baseBookingsFor(facility: FacilityKey): Booking[] {
  return BASE_BOOKINGS[facility] ?? [];
}
