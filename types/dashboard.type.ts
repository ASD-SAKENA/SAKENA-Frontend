import type { StatusColor } from "@/types/app.type";

/** A single KPI tile shown at the top of a dashboard. */
export interface KpiData {
  label: string;
  value: string;
  icon: string;
  color: StatusColor;
  sub?: string;
  subColor?: StatusColor;
}

/** Key/value row in the resident's unit-info panel. */
export interface UnitInfoRow {
  label: string;
  value: string;
}

/** Monthly charge summary card on the resident dashboard. */
export interface ChargeSummary {
  title: string;
  amount: number;
  dueLabel: string;
  progressPct: number;
  walletBalance: number;
}

export interface ResidentDashboard {
  kpis: KpiData[];
  unitInfo: UnitInfoRow[];
  charge: ChargeSummary;
}

/** One vertical bar in the manager collection chart. */
export interface ChartBar {
  label: string;
  heightPct: number;
}

/** One payment-status row in the manager breakdown panel. */
export interface PaymentBreakdown {
  label: string;
  count: string;
  pct: number;
  color: StatusColor;
}

export interface ManagerDashboard {
  kpis: KpiData[];
  chart: ChartBar[];
  breakdown: PaymentBreakdown[];
}
