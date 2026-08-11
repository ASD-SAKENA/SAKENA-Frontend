/** Response shapes of the Sakena backend residency endpoints (`/api/v1/residencies`). */

export type TenancyTypeApi = "OWNER_OCCUPIER" | "TENANT" | "COMMERCIAL";

export interface ResidencyApiResponse {
  id: string;
  apartmentId: string;
  residentId: string;
  residentName: string;
  unitNumber: string | null;
  buildingName: string | null;
  tenancy: TenancyTypeApi;
  movedInAt: string;
  movedOutAt: string | null;
  active: boolean;
}

export interface StartResidencyApiPayload {
  residentId: string;
  tenancy: TenancyTypeApi;
}
