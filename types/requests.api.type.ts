/** Response shapes of the Sakena backend service-request endpoints (`/api/v1/service-requests`). */

export type ServiceRequestApiStatus =
  | "PENDING"
  | "APPROVED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CONFIRMED"
  | "SETTLED"
  | "REJECTED";

export interface RequestingUnitApiResponse {
  unitNumber: string;
  floorNumber: number;
  buildingName: string;
}

/**
 * Who ultimately bears a completed request's cost. `ALL_UNITS` and
 * `REQUESTING_UNIT` are billed to the next charge period; `BUILDING_WALLET`
 * is paid from the building account and never reaches a unit's invoice.
 */
export type ServiceCostResponsibility =
  | "ALL_UNITS"
  | "REQUESTING_UNIT"
  | "BUILDING_WALLET";

export type ServiceCategoryGroup =
  | "FACILITIES"
  | "BUILDING"
  | "CLEANING"
  | "SECURITY"
  | "GREEN_SPACE"
  | "COMMUNICATION"
  | "GENERAL";

export interface ServiceRequestApiResponse {
  id: string;
  title: string;
  description: string;
  location: string | null;
  categoryGroup: ServiceCategoryGroup;
  subCategory: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  status: ServiceRequestApiStatus;
  assignedTo: string | null;
  resolvedAt: string | null;
  expectedCompletionAt: string | null;
  completionReport: string | null;
  completionCost: number | null;
  costResponsibility: ServiceCostResponsibility | null;
  requestingUnit: RequestingUnitApiResponse | null;
}

export interface AssignCostResponsibilityApiPayload {
  costResponsibility: ServiceCostResponsibility;
}

export interface CreateServiceRequestApiPayload {
  title: string;
  description: string;
  location?: string;
  categoryGroup: ServiceCategoryGroup;
  subCategory: string;
}

export interface CategoryOptionApiResponse {
  value: string;
  label: string;
}

export interface CategoryGroupApiResponse {
  value: string;
  label: string;
  subCategories: CategoryOptionApiResponse[];
}

export interface CategoryOptionsApiResponse {
  categories: CategoryGroupApiResponse[];
}
