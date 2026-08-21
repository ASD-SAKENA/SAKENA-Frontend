/** Response shapes of the Sakena backend facility endpoints (`/api/v1/facilities`). */

/** `java.time.DayOfWeek` as serialized by the backend. */
export type ApiDayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

/** Scheduling policy of a facility, mirroring `BookingRules` on the backend. */
export interface BookingRulesApi {
  /** Local `HH:mm:ss` — backend's LocalTime deserializer rejects any other format. */
  opensAt: string;
  closesAt: string;
  closedDays: ApiDayOfWeek[];
  minDurationMinutes: number;
  maxDurationMinutes: number;
  maxAdvanceDays: number;
  /** 0 means unlimited. */
  maxPerResidentPerWeek: number;
  hourlyPrice: number;
}

export interface FacilityApiResponse {
  id: string;
  name: string;
  icon: string | null;
  capacity: number;
  rules: BookingRulesApi;
  createdAt: string;
  updatedAt: string;
}

export interface FacilityApiPayload {
  name: string;
  icon?: string;
  capacity?: number;
  rules?: BookingRulesApi;
}

export interface BookingApiResponse {
  id: string;
  facilityId: string;
  bookedBy: string;
  startsAt: string;
  endsAt: string;
  /** People this booking brings; capacity is counted in people. */
  partySize: number;
  /** What was actually taken from the resident's wallet at booking time. */
  price: number;
}

export interface MyBookingApiResponse {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityIcon: string | null;
  startsAt: string;
  endsAt: string;
  partySize: number;
  price: number;
}

export interface CreateBookingApiPayload {
  startsAt: string;
  endsAt: string;
  partySize: number;
}
