import type { StatusColor } from "@/types/app.type";
import type {
  ServiceCategoryGroup,
  ServiceRequestApiStatus,
} from "@/types/requests.api.type";

export type RequestStatus =
  | "باز"
  | "تأییدشده"
  | "ارجاع‌شده"
  | "در حال انجام"
  | "انجام‌شده"
  | "تایید شده"
  | "تسویه‌شده"
  | "ردشده";

export type RequestPriority = "فوری" | "متوسط" | "کم" | "نامشخص";

export interface ServiceRequest {
  /** Backend UUID — used for actions; display uses `displayId`. */
  id: string;
  displayId: string;
  icon: string;
  title: string;
  type: string;
  description: string;
  categoryGroup: ServiceCategoryGroup;
  subCategory: string;
  status: RequestStatus;
  statusColor: StatusColor;
  apiStatus: ServiceRequestApiStatus;
  date: string;
  completionReport: string | null;
  completionCost: number | null;
  requestingUnit: string | null;
}

/**
 * Manager queue view adds unit, submission time and priority columns.
 * `unit` shows the resolved apartment (building floor + unit number) when
 * the request has one; falls back to "—" otherwise.
 */
export interface ManagerRequest {
  id: string;
  displayId: string;
  title: string;
  type: string;
  unit: string;
  date: string;
  status: RequestStatus;
  statusColor: StatusColor;
  apiStatus: ServiceRequestApiStatus;
  priority: RequestPriority;
  priorityColor: StatusColor;
}

export interface CreateRequestPayload {
  categoryGroup: ServiceCategoryGroup;
  subCategory: string;
  title: string;
  description: string;
}
