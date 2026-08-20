import type { StatusColor } from "@/types/app.type";
import type { ServiceRequestApiStatus } from "@/types/requests.api.type";
import type { RequestPriority, RequestStatus } from "@/types/requests.type";

export interface StaffTask {
  id: string;
  icon: string;
  title: string;
  type: string;
  /** Persian name of the category group, e.g. «تاسیسات». */
  categoryGroup: string;
  description: string;
  /** The resident's actual unit, resolved from their residency. */
  unit: string;
  /** Optional free-text detail the resident added, e.g. «راه‌پله طبقه ۳». */
  location: string | null;
  date: string;
  priority: RequestPriority;
  priorityColor: StatusColor;
  /** Same Persian status wording every other role sees. */
  status: RequestStatus;
  statusColor: StatusColor;
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
  location: string | null;
  completedAt: string;
  report: string;
  cost: string | null;
}
