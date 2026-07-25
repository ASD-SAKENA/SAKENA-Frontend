import type { StatusColor } from "@/types/app.type";
import type { ServiceRequestApiStatus } from "@/types/requests.api.type";
import type { RequestPriority } from "@/types/requests.type";

export interface StaffTask {
  id: string;
  icon: string;
  title: string;
  unit: string;
  date: string;
  priority: RequestPriority;
  priorityColor: StatusColor;
  apiStatus: ServiceRequestApiStatus;
  done: boolean;
}

export interface SummaryItem {
  label: string;
  value: string;
  icon: string;
  color: StatusColor;
}

/** A completed job in the worker's archive. */
export interface StaffHistoryItem {
  id: string;
  icon: string;
  title: string;
  unit: string;
  completedAt: string;
  report: string;
  cost: string | null;
}
