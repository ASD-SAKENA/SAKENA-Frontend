import http from "@/services/http";

import type {
  FacilityApiPayload,
  FacilityApiResponse,
} from "@/types/reserve.api.type";
import type { Facility } from "@/types/reserve.type";

export const reserveKeys = {
  facilities: ["reserve", "facilities"] as const,
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
