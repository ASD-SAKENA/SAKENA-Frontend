import http from "@/services/http";

import type {
  AddChargeItemApiPayload,
  ChargeItemApiResponse,
  ChargePeriodApiResponse,
  CreateChargePeriodApiPayload,
  ServiceChargeApiResponse,
  UnitInvoiceApiResponse,
} from "@/types/billing.api.type";

export const billingKeys = {
  all: ["billing"] as const,
  periods: (buildingId?: string) =>
    ["billing", "periods", buildingId ?? ""] as const,
  items: (periodId: string) => ["billing", "items", periodId] as const,
  invoices: (periodId: string) => ["billing", "invoices", periodId] as const,
  unitInvoices: (apartmentId: string) =>
    ["billing", "unit-invoices", apartmentId] as const,
  pendingServiceCharges: ["billing", "pending-service-charges"] as const,
};

export async function getChargePeriods(
  buildingId?: string,
): Promise<ChargePeriodApiResponse[]> {
  const { data } = await http.get<ChargePeriodApiResponse[]>(
    "/charge-periods",
    { params: buildingId ? { buildingId } : undefined },
  );
  return data;
}

export async function createChargePeriod(
  payload: CreateChargePeriodApiPayload,
): Promise<ChargePeriodApiResponse> {
  const { data } = await http.post<ChargePeriodApiResponse>(
    "/charge-periods",
    payload,
  );
  return data;
}

export async function deleteChargePeriod(id: string): Promise<void> {
  await http.delete(`/charge-periods/${id}`);
}

export async function getChargeItems(
  periodId: string,
): Promise<ChargeItemApiResponse[]> {
  const { data } = await http.get<ChargeItemApiResponse[]>(
    `/charge-periods/${periodId}/items`,
  );
  return data;
}

export async function getPendingServiceCharges(): Promise<
  ServiceChargeApiResponse[]
> {
  const { data } = await http.get<ServiceChargeApiResponse[]>(
    "/charge-periods/pending-service-charges",
  );
  return data;
}

export async function addChargeItem(
  periodId: string,
  payload: AddChargeItemApiPayload,
): Promise<ChargeItemApiResponse> {
  const { data } = await http.post<ChargeItemApiResponse>(
    `/charge-periods/${periodId}/items`,
    payload,
  );
  return data;
}

export async function removeChargeItem(
  periodId: string,
  itemId: string,
): Promise<void> {
  await http.delete(`/charge-periods/${periodId}/items/${itemId}`);
}

export async function issueChargePeriod(
  periodId: string,
): Promise<UnitInvoiceApiResponse[]> {
  const { data } = await http.post<UnitInvoiceApiResponse[]>(
    `/charge-periods/${periodId}/issue`,
  );
  return data;
}

export async function closeChargePeriod(
  periodId: string,
): Promise<ChargePeriodApiResponse> {
  const { data } = await http.post<ChargePeriodApiResponse>(
    `/charge-periods/${periodId}/close`,
  );
  return data;
}

export async function getPeriodInvoices(
  periodId: string,
): Promise<UnitInvoiceApiResponse[]> {
  const { data } = await http.get<UnitInvoiceApiResponse[]>(
    `/charge-periods/${periodId}/invoices`,
  );
  return data;
}

export async function getUnitInvoices(
  apartmentId: string,
): Promise<UnitInvoiceApiResponse[]> {
  const { data } = await http.get<UnitInvoiceApiResponse[]>("/invoices", {
    params: { apartmentId },
  });
  return data;
}

export async function registerInvoicePayment(
  invoiceId: string,
  amount: number,
): Promise<UnitInvoiceApiResponse> {
  const { data } = await http.post<UnitInvoiceApiResponse>(
    `/invoices/${invoiceId}/payments`,
    { amount },
  );
  return data;
}
