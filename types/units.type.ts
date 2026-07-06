import type { StatusColor } from "@/types/app.type";

export interface Unit {
  no: string;
  resident: string;
  tenancy: string;
  balance: string;
  balanceColor: StatusColor;
  status: string;
  statusColor: StatusColor;
}
