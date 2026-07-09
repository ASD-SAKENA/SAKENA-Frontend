import http from "@/services/http";

import { toFaDigits } from "@/lib/persian-number";

import type { ApartmentForm, BuildingForm } from "@/schemas/units.schema";

import type {
  ApartmentApiResponse,
  BuildingApiResponse,
} from "@/types/units.api.type";
import type { Unit } from "@/types/units.type";

export const unitKeys = {
  all: ["units"] as const,
  list: (buildingId?: string) => ["units", "list", buildingId ?? ""] as const,
  buildings: ["units", "buildings"] as const,
};

/**
 * Units map onto the backend `apartments` resource. Resident, charge balance
 * and settlement status are not modelled server-side yet — those columns show
 * placeholders until the finance/residency contexts land.
 */
function toUnit(apartment: ApartmentApiResponse): Unit {
  return {
    id: apartment.id,
    buildingId: apartment.buildingId,
    no: toFaDigits(apartment.unitNumber),
    resident: "—",
    tenancy: `طبقه ${toFaDigits(apartment.floorNumber)} · ${toFaDigits(apartment.bedrooms)} خوابه`,
    balance: "۰",
    balanceColor: "muted",
    status: "فعال",
    statusColor: "info",
    raw: {
      unitNumber: apartment.unitNumber,
      floorNumber: apartment.floorNumber,
      areaSquareMeters: apartment.areaSquareMeters,
      bedrooms: apartment.bedrooms,
    },
  };
}

export async function getUnits(buildingId?: string): Promise<Unit[]> {
  const { data } = await http.get<ApartmentApiResponse[]>("/apartments", {
    params: buildingId ? { buildingId } : undefined,
  });
  return data.map(toUnit);
}

export async function createApartment(payload: ApartmentForm): Promise<Unit> {
  const { data } = await http.post<ApartmentApiResponse>(
    "/apartments",
    payload,
  );
  return toUnit(data);
}

export async function updateApartment(
  id: string,
  payload: ApartmentForm,
): Promise<Unit> {
  const { data } = await http.put<ApartmentApiResponse>(
    `/apartments/${id}`,
    payload,
  );
  return toUnit(data);
}

export async function deleteApartment(id: string): Promise<void> {
  await http.delete(`/apartments/${id}`);
}

export async function getBuildings(): Promise<BuildingApiResponse[]> {
  const { data } = await http.get<BuildingApiResponse[]>("/buildings");
  return data;
}

export async function createBuilding(
  payload: BuildingForm,
): Promise<BuildingApiResponse> {
  const { data } = await http.post<BuildingApiResponse>("/buildings", payload);
  return data;
}

export async function updateBuilding(
  id: string,
  payload: BuildingForm,
): Promise<BuildingApiResponse> {
  const { data } = await http.put<BuildingApiResponse>(
    `/buildings/${id}`,
    payload,
  );
  return data;
}

export async function deleteBuilding(id: string): Promise<void> {
  await http.delete(`/buildings/${id}`);
}
