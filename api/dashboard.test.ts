import { beforeEach, describe, expect, it, vi } from "vitest";

import http from "@/services/http";

import { getManagerDashboard, getResidentDashboard } from "./dashboard";

vi.mock("@/services/http", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getResidentDashboard", () => {
  it("builds KPIs, unit info and a charge summary from a full response", async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: {
        unit: {
          buildingName: "برج نیلوفر",
          unitNumber: "12",
          floorNumber: 3,
          areaSquareMeters: 85,
          bedrooms: 2,
          tenancy: "TENANT",
        },
        walletBalance: 500000,
        currentInvoice: {
          periodTitle: "شارژ فروردین",
          amount: 1000000,
          paidAmount: 400000,
          remaining: 600000,
          status: "PARTIALLY_PAID",
          dueOn: "2026-04-01",
        },
        openRequestCount: 2,
        upcomingBookings: [
          {
            facilityName: "استخر",
            startsAt: "2026-03-10T14:00:00Z",
            endsAt: "2026-03-10T15:00:00Z",
          },
        ],
      },
    });

    const dashboard = await getResidentDashboard();

    expect(http.get).toHaveBeenCalledWith("/dashboard/resident");
    expect(dashboard.kpis).toHaveLength(4);
    expect(dashboard.kpis[0].value).toBe("۵۰۰,۰۰۰");
    expect(dashboard.kpis[1].color).toBe("warning"); // remaining > 0
    expect(dashboard.unitInfo).toContainEqual({
      label: "ساختمان",
      value: "برج نیلوفر",
    });
    expect(dashboard.charge.title).toBe("شارژ فروردین");
    expect(dashboard.charge.progressPct).toBe(40); // 400000/1000000
    expect(dashboard.hasUnit).toBe(true);
  });

  it("shows a no-unit placeholder when the resident has none", async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: {
        unit: null,
        walletBalance: 0,
        currentInvoice: null,
        openRequestCount: 0,
        upcomingBookings: [],
      },
    });

    const dashboard = await getResidentDashboard();

    expect(dashboard.unitInfo).toEqual([
      { label: "واحد", value: "هنوز واحدی به شما اختصاص نیافته است" },
    ]);
    expect(dashboard.charge.dueLabel).toBe("صورتحسابی صادر نشده");
    expect(dashboard.charge.amount).toBe(0);
    expect(dashboard.hasUnit).toBe(false);
  });

  it("marks the debt KPI success (not warning) when there is nothing owed", async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: {
        unit: null,
        walletBalance: 0,
        currentInvoice: {
          periodTitle: "شارژ",
          amount: 500000,
          paidAmount: 500000,
          remaining: 0,
          status: "PAID",
          dueOn: "2026-04-01",
        },
        openRequestCount: 0,
        upcomingBookings: [],
      },
    });

    const dashboard = await getResidentDashboard();
    const debtKpi = dashboard.kpis.find((k) => k.label === "بدهی شارژ");
    expect(debtKpi?.color).toBe("success");
  });
});

describe("getManagerDashboard", () => {
  const base = {
    totalUnits: 40,
    occupiedUnits: 35,
    billedThisPeriod: 10000000,
    collectedThisPeriod: 8000000,
    collectionRatePct: 80,
    openRequestCount: 5,
    pendingRequestCount: 2,
    periods: [
      {
        title: "فروردین",
        endsOn: "2026-02-01",
        billed: 1000,
        collected: 500,
        ratePct: 50,
      },
      {
        title: "اردیبهشت",
        endsOn: "2026-03-01",
        billed: 1000,
        collected: 1000,
        ratePct: 100,
      },
    ],
    invoiceBreakdown: { paid: 20, partiallyPaid: 10, unpaid: 5, total: 35 },
  };

  it("builds KPIs and a chart normalized against the peak period", async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { ...base, previousCollectionRatePct: 70 },
    });

    const dashboard = await getManagerDashboard();

    expect(http.get).toHaveBeenCalledWith("/dashboard/manager");
    expect(dashboard.chart).toEqual([
      { label: "فروردین", heightPct: 50 }, // 500/1000 peak
      { label: "اردیبهشت", heightPct: 100 },
    ]);
    expect(dashboard.chartNote).toContain("+");
    expect(dashboard.breakdown).toEqual([
      { label: "پرداخت‌شده", count: "۲۰ واحد", pct: 57, color: "success" },
      { label: "پرداخت ناقص", count: "۱۰ واحد", pct: 29, color: "warning" },
      { label: "پرداخت‌نشده", count: "۵ واحد", pct: 14, color: "danger" },
    ]);
  });

  it("shows a plain rate note (no delta) when there is no previous period", async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { ...base, previousCollectionRatePct: null },
    });

    const dashboard = await getManagerDashboard();
    expect(dashboard.chartNote).toBe("نرخ وصول ٪۸۰");
  });

  it("shows a negative delta when the rate dropped", async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { ...base, collectionRatePct: 60, previousCollectionRatePct: 80 },
    });

    const dashboard = await getManagerDashboard();
    expect(dashboard.chartNote).toContain("−");
  });

  it("does not divide by zero when every period collected nothing", async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: {
        ...base,
        previousCollectionRatePct: null,
        periods: [
          {
            title: "فروردین",
            endsOn: "2026-02-01",
            billed: 0,
            collected: 0,
            ratePct: 0,
          },
        ],
      },
    });

    const dashboard = await getManagerDashboard();
    expect(dashboard.chart).toEqual([{ label: "فروردین", heightPct: 0 }]);
  });
});
