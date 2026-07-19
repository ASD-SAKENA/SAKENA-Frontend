/** Response shapes of the Sakena backend facility endpoints (`/api/v1/facilities`). */

export interface FacilityApiResponse {
  id: string;
  name: string;
  icon: string | null;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface FacilityApiPayload {
  name: string;
  icon?: string;
  capacity?: number;
}

export interface BookingApiResponse {
  id: string;
  facilityId: string;
  bookedBy: string;
  startsAt: string;
  endsAt: string;
}

export interface CreateBookingApiPayload {
  startsAt: string;
  endsAt: string;
}
