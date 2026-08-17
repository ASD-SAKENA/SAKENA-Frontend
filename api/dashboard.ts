import http from "@/services/http";

import { faNumber, toFaDigits } from "@/lib/persian-number";

import type {
  InvoiceSummaryApiResponse,
  ManagerDashboardApiResponse,
  ResidentDashboardApiResponse,
  ResidentUnitApiResponse,
  TenancyTypeApi,
} from "@/types/dashboard.api.type";
import type {
  ChargeSummary,
  KpiData,
  ManagerDashboard,
  PaymentBreakdown,
  ResidentDashboard,
  UnitInfoRow,
} from "@/types/dashboard.type";

export const dashboardKeys = {
  resident: ["dashboard", "resident"] as const,
  manager: ["dashboard", "manager"] as const,
};

const TENANCY_LABELS: Record<TenancyTypeApi, string> = {
  OWNER_OCCUPIER: "مالک ساکن",
  TENANT: "مستأجر",
  COMMERCIAL: "تجاری",
};

const FA_DATE = new Intl.DateTimeFormat("fa-IR", {
  day: "numeric",
  month: "long",
});

function dueLabel(invoice: InvoiceSummaryApiResponse): string {
  return `سررسید ${FA_DATE.format(new Date(invoice.dueOn))}`;
}

/** «۳ مرداد · ۱۸:۰۰» for a booking start time. */
function bookingLabel(startsAt: string): string {
  const date = new Date(startsAt);
  return `${FA_DATE.format(date)} · ${date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function unitRows(unit: ResidentUnitApiResponse | null): UnitInfoRow[] {
  if (!unit) {
    return [{ label: "واحد", value: "هنوز واحدی به شما اختصاص نیافته است" }];
  }
  return [
    { label: "ساختمان", value: unit.buildingName },
    {
      label: "شماره واحد",
      value: `${toFaDigits(unit.unitNumber)} — طبقه ${toFaDigits(unit.floorNumber)}`,
    },
    { label: "متراژ", value: `${toFaDigits(unit.areaSquareMeters)} متر مربع` },
    { label: "تعداد خواب", value: `${toFaDigits(unit.bedrooms)} خواب` },
    { label: "وضعیت سکونت", value: TENANCY_LABELS[unit.tenancy] },
  ];
}

function residentKpis(data: ResidentDashboardApiResponse): KpiData[] {
  const invoice = data.currentInvoice;
  const nextBooking = data.upcomingBookings[0];
  return [
    {
      label: "مانده کیف پول",
      value: faNumber(data.walletBalance),
      icon: "account_balance_wallet",
      color: "gold",
      sub: "تومان",
    },
    {
      label: "بدهی شارژ",
      value: invoice ? faNumber(invoice.remaining) : "۰",
      icon: "receipt_long",
      color: invoice && invoice.remaining > 0 ? "warning" : "success",
      sub: invoice ? dueLabel(invoice) : "بدهی ندارید",
    },
    {
      label: "درخواست‌های باز",
      value: toFaDigits(data.openRequestCount),
      icon: "handyman",
      color: data.openRequestCount > 0 ? "info" : "muted",
      sub: data.openRequestCount > 0 ? "در حال بررسی" : "موردی نیست",
    },
    {
      label: "رزروهای پیش‌رو",
      value: toFaDigits(data.upcomingBookings.length),
      icon: "event_available",
      color: "success",
      sub: nextBooking
        ? `${nextBooking.facilityName} · ${bookingLabel(nextBooking.startsAt)}`
        : "رزروی ندارید",
    },
  ];
}

function chargeSummary(data: ResidentDashboardApiResponse): ChargeSummary {
  const invoice = data.currentInvoice;
  if (!invoice) {
    return {
      title: "شارژ ماهانه",
      amount: 0,
      dueLabel: "صورتحسابی صادر نشده",
      progressPct: 0,
      walletBalance: data.walletBalance,
    };
  }
  return {
    title: invoice.periodTitle,
    amount: invoice.remaining,
    dueLabel: dueLabel(invoice),
    progressPct:
      invoice.amount > 0
        ? Math.round((invoice.paidAmount / invoice.amount) * 100)
        : 0,
    walletBalance: data.walletBalance,
  };
}

export async function getResidentDashboard(): Promise<ResidentDashboard> {
  const { data } = await http.get<ResidentDashboardApiResponse>(
    "/dashboard/resident",
  );
  return {
    kpis: residentKpis(data),
    unitInfo: unitRows(data.unit),
    charge: chargeSummary(data),
    hasUnit: data.unit !== null,
  };
}

function managerKpis(data: ManagerDashboardApiResponse): KpiData[] {
  const rateDelta =
    data.previousCollectionRatePct === null
      ? null
      : data.collectionRatePct - data.previousCollectionRatePct;
  return [
    {
      label: "کل واحدها",
      value: toFaDigits(data.totalUnits),
      icon: "apartment",
      color: "info",
      sub: `${toFaDigits(data.occupiedUnits)} سکونت فعال`,
      subColor: "muted",
    },
    {
      label: "وصولی این دوره",
      value: faNumber(data.collectedThisPeriod),
      icon: "payments",
      color: "gold",
      sub: `از ${faNumber(data.billedThisPeriod)} تومان`,
      subColor: "muted",
    },
    {
      label: "درخواست‌های باز",
      value: toFaDigits(data.openRequestCount),
      icon: "assignment",
      color: data.openRequestCount > 0 ? "warning" : "muted",
      sub: `${toFaDigits(data.pendingRequestCount)} در انتظار بررسی`,
      subColor: data.pendingRequestCount > 0 ? "danger" : "muted",
    },
    {
      label: "نرخ وصول",
      value: `٪${toFaDigits(data.collectionRatePct)}`,
      icon: "trending_up",
      color: data.collectionRatePct >= 80 ? "success" : "warning",
      sub:
        rateDelta === null
          ? "دوره‌ی قبلی ندارد"
          : `${rateDelta >= 0 ? "+" : "−"}${toFaDigits(Math.abs(rateDelta))}٪ نسبت به دوره قبل`,
      subColor: rateDelta !== null && rateDelta < 0 ? "danger" : "success",
    },
  ];
}

function invoiceBreakdown(
  data: ManagerDashboardApiResponse,
): PaymentBreakdown[] {
  const { paid, partiallyPaid, unpaid, total } = data.invoiceBreakdown;
  const pct = (count: number) =>
    total > 0 ? Math.round((count / total) * 100) : 0;
  return [
    {
      label: "پرداخت‌شده",
      count: `${toFaDigits(paid)} واحد`,
      pct: pct(paid),
      color: "success",
    },
    {
      label: "پرداخت ناقص",
      count: `${toFaDigits(partiallyPaid)} واحد`,
      pct: pct(partiallyPaid),
      color: "warning",
    },
    {
      label: "پرداخت‌نشده",
      count: `${toFaDigits(unpaid)} واحد`,
      pct: pct(unpaid),
      color: "danger",
    },
  ];
}

export async function getManagerDashboard(): Promise<ManagerDashboard> {
  const { data } =
    await http.get<ManagerDashboardApiResponse>("/dashboard/manager");
  const peak = Math.max(...data.periods.map((p) => p.collected), 0);
  const delta =
    data.previousCollectionRatePct === null
      ? null
      : data.collectionRatePct - data.previousCollectionRatePct;
  return {
    kpis: managerKpis(data),
    chartNote:
      delta === null
        ? `نرخ وصول ٪${toFaDigits(data.collectionRatePct)}`
        : `${delta >= 0 ? "+" : "−"}${toFaDigits(Math.abs(delta))}٪ نسبت به دوره قبل`,
    chart: data.periods.map((period) => ({
      label: period.title,
      heightPct: peak > 0 ? Math.round((period.collected / peak) * 100) : 0,
    })),
    breakdown: invoiceBreakdown(data),
  };
}
