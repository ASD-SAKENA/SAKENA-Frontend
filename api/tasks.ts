import http from "@/services/http";

import { formatFaDate } from "@/lib/format-date";
import { toFaDigits } from "@/lib/persian-number";

import type { TaskApiResponse } from "@/types/tasks.api.type";
import type { StaffTask, SummaryItem } from "@/types/tasks.type";

export const taskKeys = {
  all: ["tasks"] as const,
  staff: ["tasks", "staff"] as const,
  summary: ["tasks", "summary"] as const,
};

/**
 * The backend task is generic (title/description/status). Unit, priority and
 * icon are not modelled server-side yet, so display defaults fill the gaps.
 */
function toStaffTask(task: TaskApiResponse): StaffTask {
  return {
    id: task.id,
    icon: "handyman",
    title: task.title,
    unit: "—",
    date: formatFaDate(task.createdAt),
    priority: "متوسط",
    priorityColor: "warning",
    done: task.status === "DONE",
  };
}

export async function getStaffTasks(): Promise<StaffTask[]> {
  const { data } = await http.get<TaskApiResponse[]>("/tasks");
  return data.map(toStaffTask);
}

export async function getStaffSummary(): Promise<SummaryItem[]> {
  const { data } = await http.get<TaskApiResponse[]>("/tasks");
  const open = data.filter((t) => t.status !== "DONE").length;
  const inProgress = data.filter((t) => t.status === "IN_PROGRESS").length;
  const done = data.filter((t) => t.status === "DONE").length;
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

export async function createTask(
  title: string,
  description?: string,
): Promise<StaffTask> {
  const { data } = await http.post<TaskApiResponse>("/tasks", {
    title,
    description,
  });
  return toStaffTask(data);
}

export async function completeTask(id: string): Promise<StaffTask> {
  const { data } = await http.patch<TaskApiResponse>(`/tasks/${id}/status`, {
    status: "DONE",
  });
  return toStaffTask(data);
}
