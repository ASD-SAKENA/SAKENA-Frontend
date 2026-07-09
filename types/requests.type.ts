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
  | "ردشده";

export type RequestPriority = "فوری" | "متوسط" | "کم";

export interface ServiceRequest {
  /** Backend UUID — used for actions; display uses `displayId`. */
  id: string;
  displayId: string;
  icon: string;
  title: string;
  type: string;
  description: string;
  status: RequestStatus;
  statusColor: StatusColor;
  apiStatus: ServiceRequestApiStatus;
  date: string;
}

/** Manager queue view adds unit + priority columns. */
export interface ManagerRequest {
  id: string;
  displayId: string;
  title: string;
  type: string;
  unit: string;
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
