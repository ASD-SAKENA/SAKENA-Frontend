import { getAssignedRequests } from "@/api/requests";

import { formatFaDate } from "@/lib/format-date";
import { toFaDigits } from "@/lib/persian-number";
import { CATEGORY_GROUP_ICONS } from "@/lib/service-requests";

import type { ServiceRequestApiResponse } from "@/types/requests.api.type";
import type { StaffTask, SummaryItem } from "@/types/tasks.type";

export const taskKeys = {
  all: ["tasks"] as const,
  staff: ["tasks", "staff"] as const,
  summary: ["tasks", "summary"] as const,
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
