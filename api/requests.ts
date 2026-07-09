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
  CategoryOptionsApiResponse,
  CreateServiceRequestApiPayload,
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

function toServiceRequest(r: ServiceRequestApiResponse): ServiceRequest {
  const meta = REQUEST_STATUS_META[r.status];
  return {
    id: r.id,
    displayId: toFaDigits(shortRequestId(r.id)),
    icon: CATEGORY_GROUP_ICONS[r.categoryGroup] ?? "handyman",
    title: r.title,
    type: subCategoryLabel(r.subCategory),
    description: r.description,
    status: meta.label,
    statusColor: meta.color,
    apiStatus: r.status,
    date: formatFaDate(r.createdAt),
  };
}

/**
 * Priority is not modelled server-side yet — the queue shows a neutral
 * default until the backend adds it. `unit` maps to the request location.
 */
function toManagerRequest(r: ServiceRequestApiResponse): ManagerRequest {
  const meta = REQUEST_STATUS_META[r.status];
  return {
    id: r.id,
    displayId: toFaDigits(shortRequestId(r.id)),
    title: r.title,
    type: subCategoryLabel(r.subCategory),
    unit: r.location ?? "—",
    status: meta.label,
    statusColor: meta.color,
    apiStatus: r.status,
    priority: "متوسط",
    priorityColor: "warning",
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
  };
  const { data } = await http.post<ServiceRequestApiResponse>(
    "/service-requests",
    body,
  );
  return { id: data.id };
}

export async function approveRequest(id: string): Promise<void> {
  await http.patch(`/service-requests/${id}/approve`);
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
