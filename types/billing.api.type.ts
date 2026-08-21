/** Response shapes of the Sakena backend billing endpoints (`/api/v1/charge-periods`, `/api/v1/invoices`). */

export type ChargePeriodApiType = "MONTHLY" | "QUARTERLY" | "CUSTOM";

export type ChargePeriodApiStatus = "DRAFT" | "ISSUED" | "CLOSED";

export type ChargeItemApiKind =
  | "RECURRING_CHARGE"
  | "FACILITY_COST"
  | "EXTRAORDINARY_EXPENSE";

export type CostAllocationApi = "EQUAL" | "BY_AREA";

export type InvoiceApiStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID";

export type ServiceChargeApiTarget = "ALL_UNITS" | "SPECIFIC_UNIT";

export interface ChargePeriodApiResponse {
  id: string;
  buildingId: string;
  title: string;
  type: ChargePeriodApiType;
  startsOn: string;
  endsOn: string;
  status: ChargePeriodApiStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ChargeItemApiResponse {
  id: string;
  periodId: string;
  title: string;
  amount: number;
  kind: ChargeItemApiKind;
  allocation: CostAllocationApi;
  createdAt: string;
}

export interface ServiceChargeApiResponse {
  id: string;
  sourceServiceRequestId: string;
  buildingId: string;
  title: string;
  amount: number;
  target: ServiceChargeApiTarget;
  targetApartmentId: string | null;
  createdAt: string;
}

export interface UnitInvoiceApiResponse {
  id: string;
  periodId: string;
  periodTitle: string;
  startsOn: string | null;
  endsOn: string | null;
  apartmentId: string;
  unitNumber: string | null;
  residentUsername: string | null;
  amount: number;
  paidAmount: number;
  remaining: number;
  status: InvoiceApiStatus;
  issuedAt: string;
}

export interface CreateChargePeriodApiPayload {
  buildingId: string;
  title: string;
  type: ChargePeriodApiType;
  startsOn: string;
  endsOn: string;
}

export interface AddChargeItemApiPayload {
  title: string;
  amount: number;
  kind: ChargeItemApiKind;
  allocation: CostAllocationApi;
}
