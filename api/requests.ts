import http from "@/services/http";

import { formatFaDate } from "@/lib/format-date";
import { toFaDigits } from "@/lib/persian-number";
import {
  CATEGORY_GROUP_ICONS,
  REQUEST_STATUS_META,
  shortRequestId,
  subCategoryLabel,
} from "@/lib/service-requests";

import type {
  AssignCostResponsibilityApiPayload,
  CategoryOptionsApiResponse,
  CreateServiceRequestApiPayload,
  ServiceCostResponsibility,
  ServiceRequestApiResponse,
} from "@/types/requests.api.type";
import type {
  CreateRequestPayload,
  ManagerRequest,
  ServiceRequest,
} from "@/types/requests.type";

export const requestKeys = {
  all: ["requests"] as const,
  resident: ["requests", "resident"] as const,
  manager: ["requests", "manager"] as const,
  assigned: ["requests", "assigned"] as const,
  categories: ["requests", "categories"] as const,
};

export function unitLabel(
  unit: ServiceRequestApiResponse["requestingUnit"],
): string | null {
  if (!unit) return null;
  return `${toFaDigits(unit.unitNumber)} — طبقه ${toFaDigits(unit.floorNumber)}`;
}

function toServiceRequest(r: ServiceRequestApiResponse): ServiceRequest {
  const meta = REQUEST_STATUS_META[r.status];
  return {
    id: r.id,
    displayId: toFaDigits(shortRequestId(r.id)),
    icon: CATEGORY_GROUP_ICONS[r.categoryGroup] ?? "handyman",
    title: r.title,
    type: subCategoryLabel(r.subCategory),
    description: r.description,
    categoryGroup: r.categoryGroup,
    subCategory: r.subCategory,
    status: meta.label,
    statusColor: meta.color,
    apiStatus: r.status,
    date: formatFaDate(r.createdAt),
    completionReport: r.completionReport,
    completionCost: r.completionCost,
    requestingUnit: unitLabel(r.requestingUnit),
    location: r.location,
  };
}

/**
 * `unit` shows the resolved apartment (building floor + unit number) when
 * the request has one; falls back to "—" for the legacy/staff-filed
 * requests that predate the residency-required-to-file gate, which have no
 * requesting apartment at all. Priority is not modelled server-side yet —
 * shown as "نامشخص" rather than a fabricated level.
 */
function toManagerRequest(r: ServiceRequestApiResponse): ManagerRequest {
  const meta = REQUEST_STATUS_META[r.status];
  return {
    id: r.id,
    displayId: toFaDigits(shortRequestId(r.id)),
    title: r.title,
    type: subCategoryLabel(r.subCategory),
    unit: unitLabel(r.requestingUnit) ?? "—",
    requestingUnit: unitLabel(r.requestingUnit),
    date: formatFaDate(r.createdAt),
    status: meta.label,
    statusColor: meta.color,
    apiStatus: r.status,
    priority: "نامشخص",
    priorityColor: "muted",
    costResponsibility: r.costResponsibility,
    completionCost: r.completionCost,
    assignedTo: r.assignedTo,
  };
}

export async function getResidentRequests(): Promise<ServiceRequest[]> {
  const { data } =
    await http.get<ServiceRequestApiResponse[]>("/service-requests");
  return data.map(toServiceRequest);
}

export async function getManagerRequests(): Promise<ManagerRequest[]> {
  const { data } = await http.get<ServiceRequestApiResponse[]>(
    "/service-requests/admin",
  );
  return data.map(toManagerRequest);
}

export async function getAssignedRequests(): Promise<
  ServiceRequestApiResponse[]
> {
  const { data } = await http.get<ServiceRequestApiResponse[]>(
    "/service-requests/assigned-to-me",
  );
  return data;
}

export async function getRequestCategories(): Promise<CategoryOptionsApiResponse> {
  const { data } = await http.get<CategoryOptionsApiResponse>(
    "/service-requests/categories",
  );
  return data;
}

export async function createRequest(
  payload: CreateRequestPayload,
): Promise<{ id: string }> {
  const body: CreateServiceRequestApiPayload = {
    title: payload.title,
    description: payload.description,
    categoryGroup: payload.categoryGroup,
    subCategory: payload.subCategory,
    location: payload.location,
  };
  const { data } = await http.post<ServiceRequestApiResponse>(
    "/service-requests",
    body,
  );
  return { id: data.id };
}

export async function updateRequest(
  id: string,
  payload: CreateRequestPayload,
): Promise<void> {
  const body: CreateServiceRequestApiPayload = {
    title: payload.title,
    description: payload.description,
    categoryGroup: payload.categoryGroup,
    subCategory: payload.subCategory,
    location: payload.location,
  };
  await http.patch(`/service-requests/${id}`, body);
}

export async function approveRequest(id: string): Promise<void> {
  await http.patch(`/service-requests/${id}/approve`);
}

export async function rejectRequest(id: string): Promise<void> {
  await http.patch(`/service-requests/${id}/reject`);
}

export async function assignRequest(
  id: string,
  workerId: string,
): Promise<void> {
  await http.patch(`/service-requests/${id}/assign`, undefined, {
    params: { workerId },
  });
}

export async function startRequestProgress(id: string): Promise<void> {
  await http.patch(`/service-requests/${id}/start-progress`, {});
}

export async function completeRequest(
  id: string,
  completionReport?: string,
  completionCost?: number,
): Promise<void> {
  await http.patch(`/service-requests/${id}/complete`, {
    completionReport,
    completionCost,
  });
}

export async function confirmCompletion(
  id: string,
  score: number,
): Promise<void> {
  await http.patch(`/service-requests/${id}/confirm`, { score });
}

export async function rejectCompletion(id: string): Promise<void> {
  await http.patch(`/service-requests/${id}/reject-completion`, {});
}

/** Manager decides how a completed request's cost is paid, before settling it. */
export async function assignCostResponsibility(
  id: string,
  costResponsibility: ServiceCostResponsibility,
): Promise<void> {
  const payload: AssignCostResponsibilityApiPayload = { costResponsibility };
  await http.patch(`/service-requests/${id}/cost-responsibility`, payload);
}
