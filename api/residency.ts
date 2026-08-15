import http from "@/services/http";

import type {
  ResidencyApiResponse,
  StartResidencyApiPayload,
} from "@/types/residency.api.type";

export const residencyKeys = {
  all: ["residencies"] as const,
  mine: ["residencies", "me"] as const,
  byBuilding: (buildingId: string | null) =>
    ["residencies", "building", buildingId ?? "all"] as const,
};

/** The unit the signed-in resident occupies; null while none is assigned. */
export async function getMyResidency(): Promise<ResidencyApiResponse | null> {
  const { data } = await http.get<ResidencyApiResponse | "">("/residencies/me");
  // An unassigned resident yields an empty body rather than a 404.
  return data === "" ? null : data;
}

/** Active residencies of one building, or of every building when buildingId is null. */
export async function getBuildingResidencies(
  buildingId: string | null,
): Promise<ResidencyApiResponse[]> {
  const { data } = await http.get<ResidencyApiResponse[]>("/residencies", {
    params: buildingId ? { buildingId } : undefined,
  });
  return data;
}

export async function startResidency(
  apartmentId: string,
  payload: StartResidencyApiPayload,
): Promise<ResidencyApiResponse> {
  const { data } = await http.post<ResidencyApiResponse>(
    `/residencies/apartments/${apartmentId}`,
    payload,
  );
  return data;
}

export async function endResidency(
  apartmentId: string,
): Promise<ResidencyApiResponse> {
  const { data } = await http.delete<ResidencyApiResponse>(
    `/residencies/apartments/${apartmentId}`,
  );
  return data;
}
