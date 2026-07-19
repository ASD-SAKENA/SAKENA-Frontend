import { getAssignedRequests } from "@/api/requests";

import { formatFaDate } from "@/lib/format-date";
import { faNumber, toFaDigits } from "@/lib/persian-number";
import { CATEGORY_GROUP_ICONS } from "@/lib/service-requests";

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
 * Priority is not modelled server-side yet — a neutral default fills the gap.
 */
function toStaffTask(r: ServiceRequestApiResponse): StaffTask {
  return {
    id: r.id,
    icon: CATEGORY_GROUP_ICONS[r.categoryGroup] ?? "handyman",
    title: r.title,
    unit: r.location ?? "—",
    date: formatFaDate(r.createdAt),
    priority: "متوسط",
    priorityColor: "warning",
    apiStatus: r.status,
    done: r.status === "COMPLETED",
  };
}

export async function getStaffTasks(): Promise<StaffTask[]> {
  const data = await getAssignedRequests();
  return data.map(toStaffTask);
}

export async function getStaffSummary(): Promise<SummaryItem[]> {
  const data = await getAssignedRequests();
  const open = data.filter(
    (r) => r.status !== "COMPLETED" && r.status !== "REJECTED",
  ).length;
  const inProgress = data.filter((r) => r.status === "IN_PROGRESS").length;
  const done = data.filter((r) => r.status === "COMPLETED").length;
  return [
    {
      label: "کارهای باز",
      value: toFaDigits(open),
      icon: "pending_actions",
      color: "warning",
    },
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
  ];
}

/** The worker's completed jobs, newest first — date, unit and report. */
export async function getStaffHistory(): Promise<StaffHistoryItem[]> {
  const data = await getAssignedRequests();
  return data
    .filter((r) => r.status === "COMPLETED")
    .sort(
      (a, b) =>
        new Date(b.resolvedAt ?? b.updatedAt).getTime() -
        new Date(a.resolvedAt ?? a.updatedAt).getTime(),
    )
    .map((r) => ({
      id: r.id,
      icon: CATEGORY_GROUP_ICONS[r.categoryGroup] ?? "handyman",
      title: r.title,
      unit: r.location ?? "—",
      completedAt: formatFaDate(r.resolvedAt ?? r.updatedAt),
      report: r.completionReport ?? "گزارشی ثبت نشده است",
      cost: r.completionCost !== null ? faNumber(r.completionCost) : null,
    }));
}
