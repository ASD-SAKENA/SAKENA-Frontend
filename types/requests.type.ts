import type { StatusColor } from "@/types/app.type";

export type RequestStatus = "باز" | "ارجاع‌شده" | "در حال انجام" | "انجام‌شده";

export type RequestPriority = "فوری" | "متوسط" | "کم";

export interface ServiceRequest {
  id: string;
  icon: string;
  title: string;
  type: string;
  description: string;
  status: RequestStatus;
  statusColor: StatusColor;
  date: string;
}

/** Manager queue view adds unit + priority columns. */
export interface ManagerRequest {
  id: string;
  title: string;
  type: string;
  unit: string;
  status: RequestStatus;
  statusColor: StatusColor;
  priority: RequestPriority;
  priorityColor: StatusColor;
}

export interface CreateRequestPayload {
  type: string;
  description: string;
}
