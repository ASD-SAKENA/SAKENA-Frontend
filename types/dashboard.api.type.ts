/** Response shapes of the Sakena backend dashboard endpoints (`/api/v1/dashboard`). */

export type InvoiceStatusApi = "UNPAID" | "PARTIALLY_PAID" | "PAID";

export type TenancyTypeApi = "OWNER_OCCUPIER" | "TENANT" | "COMMERCIAL";

export interface ResidentUnitApiResponse {
  buildingName: string;
  unitNumber: string;
  floorNumber: number;
  areaSquareMeters: number;
  bedrooms: number;
  tenancy: TenancyTypeApi;
}

export interface InvoiceSummaryApiResponse {
  periodTitle: string;
  amount: number;
  paidAmount: number;
  remaining: number;
  status: InvoiceStatusApi;
  /** `YYYY-MM-DD`. */
  dueOn: string;
}

export interface UpcomingBookingApiResponse {
  facilityName: string;
  startsAt: string;
  endsAt: string;
}

export interface ResidentDashboardApiResponse {
  unit: ResidentUnitApiResponse | null;
  walletBalance: number;
  currentInvoice: InvoiceSummaryApiResponse | null;
  openRequestCount: number;
  upcomingBookings: UpcomingBookingApiResponse[];
}

export interface PeriodCollectionApiResponse {
  title: string;
  endsOn: string;
  billed: number;
  collected: number;
  ratePct: number;
}

export interface InvoiceBreakdownApiResponse {
  paid: number;
  partiallyPaid: number;
  unpaid: number;
  total: number;
}

export interface ManagerDashboardApiResponse {
  totalUnits: number;
  occupiedUnits: number;
  billedThisPeriod: number;
  collectedThisPeriod: number;
  collectionRatePct: number;
  previousCollectionRatePct: number | null;
  openRequestCount: number;
  pendingRequestCount: number;
  periods: PeriodCollectionApiResponse[];
  invoiceBreakdown: InvoiceBreakdownApiResponse;
}
