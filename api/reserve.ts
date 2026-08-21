import http from "@/services/http";

import {
  API_WEEK_DAYS,
  DEFAULT_RULES,
  rangeToGrid,
  SLOT_MINUTES,
  slotToDate,
  weekRange,
} from "@/lib/reserve-time";

import type {
  BookingApiResponse,
  BookingRulesApi,
  FacilityApiPayload,
  FacilityApiResponse,
  MyBookingApiResponse,
} from "@/types/reserve.api.type";
import type {
  Facility,
  FacilityRules,
  GridBooking,
  MyBooking,
} from "@/types/reserve.type";

export const reserveKeys = {
  facilities: ["reserve", "facilities"] as const,
  bookingsRoot: ["reserve", "bookings"] as const,
  bookings: (facilityId: string, week: number) =>
    ["reserve", "bookings", facilityId, week] as const,
  myBookings: ["reserve", "bookings", "mine"] as const,
};

const DEFAULT_FACILITY_ICON = "pool";

/** `HH:mm[:ss]` → hour, keeping a half-hour opening as a fraction. */
function toHour(time: string): number {
  const [hours = "0", minutes = "0"] = time.split(":");
  return Number(hours) + (Number(minutes) >= 30 ? 0.5 : 0);
}

function toRules(api: BookingRulesApi): FacilityRules {
  const startHour = Math.floor(toHour(api.opensAt));
  const endHour = Math.ceil(toHour(api.closesAt));
  return {
    startHour,
    endHour,
    slots: Math.max(Math.round(((endHour - startHour) * 60) / SLOT_MINUTES), 1),
    closedDays: api.closedDays
      .map((day) => API_WEEK_DAYS.indexOf(day))
      .filter((index) => index >= 0),
    minSlots: Math.max(Math.round(api.minDurationMinutes / SLOT_MINUTES), 1),
    maxSlots: Math.max(Math.round(api.maxDurationMinutes / SLOT_MINUTES), 1),
    maxAdvanceDays: api.maxAdvanceDays,
    maxPerWeek: api.maxPerResidentPerWeek,
    hourlyPrice: api.hourlyPrice,
  };
}

function toFacility(data: FacilityApiResponse): Facility {
  return {
    id: data.id,
    label: data.name,
    icon: data.icon ?? DEFAULT_FACILITY_ICON,
    capacity: data.capacity,
    rules: data.rules ? toRules(data.rules) : DEFAULT_RULES,
  };
}

export async function getFacilities(): Promise<Facility[]> {
  const { data } = await http.get<FacilityApiResponse[]>("/facilities");
  return data.map(toFacility);
}

export async function createFacility(
  payload: FacilityApiPayload,
): Promise<Facility> {
  const { data } = await http.post<FacilityApiResponse>("/facilities", payload);
  return toFacility(data);
}

export async function updateFacility(
  id: string,
  payload: FacilityApiPayload,
): Promise<Facility> {
  const { data } = await http.put<FacilityApiResponse>(
    `/facilities/${id}`,
    payload,
  );
  return toFacility(data);
}

export async function deleteFacility(id: string): Promise<void> {
  await http.delete(`/facilities/${id}`);
}

export async function getBookings(
  facilityId: string,
  weekOffset: number,
  rules: FacilityRules,
  myUserId: string | null,
): Promise<GridBooking[]> {
  const { from, to } = weekRange(weekOffset);
  const { data } = await http.get<BookingApiResponse[]>(
    `/facilities/${facilityId}/bookings`,
    { params: { from, to } },
  );
  return data
    .map((booking) => {
      const grid = rangeToGrid(
        weekOffset,
        booking.startsAt,
        booking.endsAt,
        rules,
      );
      if (!grid) return null;
      return {
        id: booking.id,
        ...grid,
        partySize: booking.partySize,
        price: booking.price,
        startsAt: new Date(booking.startsAt),
        endsAt: new Date(booking.endsAt),
        mine: myUserId !== null && booking.bookedBy === myUserId,
      };
    })
    .filter((b): b is GridBooking => b !== null);
}

/** The signed-in resident's upcoming bookings across every facility. */
export async function getMyBookings(): Promise<MyBooking[]> {
  const { data } = await http.get<MyBookingApiResponse[]>(
    "/facilities/my-bookings",
  );
  return data
    .map((booking) => ({
      id: booking.id,
      facilityId: booking.facilityId,
      facilityLabel: booking.facilityName,
      facilityIcon: booking.facilityIcon ?? DEFAULT_FACILITY_ICON,
      startsAt: new Date(booking.startsAt),
      endsAt: new Date(booking.endsAt),
      partySize: booking.partySize,
      price: booking.price,
    }))
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}

export async function createBooking(
  facilityId: string,
  weekOffset: number,
  day: number,
  start: number,
  dur: number,
  startHour: number,
  partySize: number,
): Promise<{ id: string }> {
  const { data } = await http.post<BookingApiResponse>(
    `/facilities/${facilityId}/bookings`,
    {
      startsAt: slotToDate(weekOffset, day, start, startHour).toISOString(),
      endsAt: slotToDate(weekOffset, day, start + dur, startHour).toISOString(),
      partySize,
    },
  );
  return { id: data.id };
}

export async function cancelBooking(
  facilityId: string,
  bookingId: string,
): Promise<void> {
  await http.delete(`/facilities/${facilityId}/bookings/${bookingId}`);
}
