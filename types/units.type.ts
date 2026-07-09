import type { StatusColor } from "@/types/app.type";

export interface Unit {
  /** Backend UUID — used for edit/delete actions. */
  id: string;
  buildingId: string;
  no: string;
  resident: string;
  tenancy: string;
  balance: string;
  balanceColor: StatusColor;
  status: string;
  statusColor: StatusColor;
  /** Raw values for pre-filling the edit form. */
  raw: {
    unitNumber: string;
    floorNumber: number;
    areaSquareMeters: number;
    bedrooms: number;
  };
}
