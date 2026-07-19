import http from "@/services/http";

import { rangeToGrid, slotToDate, weekRange } from "@/lib/reserve-time";

import type {
  BookingApiResponse,
  FacilityApiPayload,
  FacilityApiResponse,
} from "@/types/reserve.api.type";
import type { Facility, GridBooking } from "@/types/reserve.type";

export const reserveKeys = {
  facilities: ["reserve", "facilities"] as const,
  bookingsRoot: ["reserve", "bookings"] as const,
  bookings: (facilityId: string, week: number) =>
    ["reserve", "bookings", facilityId, week] as const,
};

const DEFAULT_FACILITY_ICON = "pool";

function toFacility(data: FacilityApiResponse): Facility {
  return {
    id: data.id,
    label: data.name,
    icon: data.icon ?? DEFAULT_FACILITY_ICON,
    capacity: data.capacity,
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
  myUserId: string | null,
): Promise<GridBooking[]> {
  const { from, to } = weekRange(weekOffset);
  const { data } = await http.get<BookingApiResponse[]>(
    `/facilities/${facilityId}/bookings`,
    { params: { from, to } },
  );
  return data
    .map((booking) => {
      const grid = rangeToGrid(weekOffset, booking.startsAt, booking.endsAt);
      if (!grid) return null;
      return {
        id: booking.id,
        ...grid,
        mine: myUserId !== null && booking.bookedBy === myUserId,
      };
    })
    .filter((b): b is GridBooking => b !== null);
}

export async function createBooking(
  facilityId: string,
  weekOffset: number,
  day: number,
  start: number,
  dur: number,
): Promise<{ id: string }> {
  const { data } = await http.post<BookingApiResponse>(
    `/facilities/${facilityId}/bookings`,
    {
      startsAt: slotToDate(weekOffset, day, start).toISOString(),
      endsAt: slotToDate(weekOffset, day, start + dur).toISOString(),
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
