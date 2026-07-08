import http from "@/services/http";

import { toFaDigits } from "@/lib/persian-number";

import type {
  ApartmentApiResponse,
  BuildingApiResponse,
} from "@/types/units.api.type";
import type { Unit } from "@/types/units.type";

export const unitKeys = {
  all: ["units"] as const,
  list: ["units", "list"] as const,
  buildings: ["units", "buildings"] as const,
};

/**
 * Units map onto the backend `apartments` resource. Resident, charge balance
 * and settlement status are not modelled server-side yet — those columns show
 * placeholders until the finance/residency contexts land.
 */
function toUnit(apartment: ApartmentApiResponse): Unit {
  return {
    no: toFaDigits(apartment.unitNumber),
    resident: "—",
    tenancy: `طبقه ${toFaDigits(apartment.floorNumber)} · ${toFaDigits(apartment.bedrooms)} خوابه`,
    balance: "۰",
    balanceColor: "muted",
    status: "فعال",
    statusColor: "info",
  };
}

export async function getUnits(buildingId?: string): Promise<Unit[]> {
  const { data } = await http.get<ApartmentApiResponse[]>("/apartments", {
    params: buildingId ? { buildingId } : undefined,
  });
  return data.map(toUnit);
}

export async function getBuildings(): Promise<BuildingApiResponse[]> {
  const { data } = await http.get<BuildingApiResponse[]>("/buildings");
  return data;
}
