import type { StatusColor } from "@/types/app.type";
import type {
  ServiceCategoryGroup,
  ServiceCostResponsibility,
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
  location: string | null;
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
  requestingUnit: string | null;
  date: string;
  status: RequestStatus;
  statusColor: StatusColor;
  apiStatus: ServiceRequestApiStatus;
  priority: RequestPriority;
  priorityColor: StatusColor;
  /** Null until the manager picks how the completed request's cost is paid. */
  costResponsibility: ServiceCostResponsibility | null;
  completionCost: number | null;
  /** Staff user id; resolved to a name against the staff directory. */
  assignedTo: string | null;
}

export interface CreateRequestPayload {
  categoryGroup: ServiceCategoryGroup;
  subCategory: string;
  title: string;
  description: string;
  /** Free-text detail; the unit itself comes from the resident's residency. */
  location?: string;
}
