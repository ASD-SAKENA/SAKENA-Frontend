import { getAssignedRequests, unitLabel } from "@/api/requests";

import { formatFaDate } from "@/lib/format-date";
import { faNumber, toFaDigits } from "@/lib/persian-number";
import {
  CATEGORY_GROUP_ICONS,
  CATEGORY_GROUP_LABELS,
  REQUEST_STATUS_META,
  statusGroupOf,
  subCategoryLabel,
} from "@/lib/service-requests";

import type { ServiceRequestApiResponse } from "@/types/requests.api.type";
import type {
  StaffHistoryItem,
  StaffTask,
  SummaryItem,
} from "@/types/tasks.type";

export const taskKeys = {
  all: ["tasks"] as const,
  staff: ["tasks", "staff"] as const,
  summary: ["tasks", "summary"] as const,
  history: ["tasks", "history"] as const,
};

/**
 * Staff "tasks" are the service requests assigned to the current user.
 */
function toStaffTask(r: ServiceRequestApiResponse): StaffTask {
  return {
    id: r.id,
    icon: CATEGORY_GROUP_ICONS[r.categoryGroup] ?? "handyman",
    title: r.title,
    type: subCategoryLabel(r.subCategory),
    categoryGroup: CATEGORY_GROUP_LABELS[r.categoryGroup] ?? r.categoryGroup,
    description: r.description,
    // The unit comes from the resident's residency; `location` is the free-text
    // detail they optionally add on top of it, so the two are shown separately.
    unit: unitLabel(r.requestingUnit) ?? "—",
    location: r.location,
    date: formatFaDate(r.createdAt),
    status: REQUEST_STATUS_META[r.status].label,
    statusColor: REQUEST_STATUS_META[r.status].color,
    apiStatus: r.status,
    done: statusGroupOf(r.status) === "done",
  };
}

export async function getStaffTasks(): Promise<StaffTask[]> {
  const data = await getAssignedRequests();
  return data.map(toStaffTask);
}

export async function getStaffSummary(): Promise<SummaryItem[]> {
  const data = await getAssignedRequests();
  // Counted off the same groups the tabs filter by, so the tiles and the list
  // can never disagree about what a status means.
  const inProgress = data.filter(
    (r) => statusGroupOf(r.status) === "progress",
  ).length;
  const done = data.filter((r) => statusGroupOf(r.status) === "done").length;
  const rejected = data.filter(
    (r) => statusGroupOf(r.status) === "rejected",
  ).length;
  return [
    {
      label: "در جریان",
      value: toFaDigits(inProgress),
      icon: "autorenew",
      color: "info",
    },
    {
      label: "انجام‌شده",
      value: toFaDigits(done),
      icon: "task_alt",
      color: "success",
    },
    {
      label: "ردشده",
      value: toFaDigits(rejected),
      icon: "close",
      color: "danger",
    },
  ];
}

/** The worker's completed jobs, newest first — date, unit and report. */
export async function getStaffHistory(): Promise<StaffHistoryItem[]> {
  const data = await getAssignedRequests();
  return data
    .filter((r) => r.status === "CONFIRMED" || r.status === "SETTLED")
    .sort(
      (a, b) =>
        new Date(b.resolvedAt ?? b.updatedAt).getTime() -
        new Date(a.resolvedAt ?? a.updatedAt).getTime(),
    )
    .map((r) => ({
      id: r.id,
      icon: CATEGORY_GROUP_ICONS[r.categoryGroup] ?? "handyman",
      title: r.title,
      unit: unitLabel(r.requestingUnit) ?? "—",
      location: r.location,
      completedAt: formatFaDate(r.resolvedAt ?? r.updatedAt),
      report: r.completionReport ?? "گزارشی ثبت نشده است",
      cost: r.completionCost !== null ? faNumber(r.completionCost) : null,
    }));
}
