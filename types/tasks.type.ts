import type { StatusColor } from "@/types/app.type";
import type { RequestPriority } from "@/types/requests.type";

export interface StaffTask {
  id: string;
  icon: string;
  title: string;
  unit: string;
  date: string;
  priority: RequestPriority;
  priorityColor: StatusColor;
  done: boolean;
}

export interface SummaryItem {
  label: string;
  value: string;
  icon: string;
  color: StatusColor;
}
