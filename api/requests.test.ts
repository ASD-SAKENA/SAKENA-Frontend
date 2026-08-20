import { beforeEach, describe, expect, it, vi } from "vitest";

import http from "@/services/http";

import {
  approveRequest,
  assignCostResponsibility,
  assignRequest,
  completeRequest,
  createRequest,
  getAssignedRequests,
  getManagerRequests,
  getRequestCategories,
  getResidentRequests,
  rejectRequest,
  startRequestProgress,
} from "./requests";

vi.mock("@/services/http", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const rawRequest = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  categoryGroup: "FACILITIES",
  subCategory: "ELEVATOR",
  title: "آسانسور خراب",
  description: "توضیحات",
  status: "PENDING",
  location: "واحد ۵",
  createdAt: "2026-03-05T10:00:00Z",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getResidentRequests", () => {
  it("maps the backend status to a Persian label/color", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [rawRequest] });
    const [req] = await getResidentRequests();
    expect(http.get).toHaveBeenCalledWith("/service-requests");
    expect(req.status).toBe("باز");
    expect(req.statusColor).toBe("warning");
    expect(req.displayId).toBe("a۱b۲c۳d۴"); // shortRequestId then Persian digits
  });

  it("maps requestingUnit to a display label", async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: [
        {
          ...rawRequest,
          requestingUnit: {
            unitNumber: "12",
            floorNumber: 3,
            buildingName: "برج نیلوفر",
          },
        },
      ],
    });
    const [req] = await getResidentRequests();
    expect(req.requestingUnit).toBe("۱۲ — طبقه ۳");
  });
});

describe("getManagerRequests", () => {
  it("shows an honest 'نامشخص' priority instead of a fabricated level", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [rawRequest] });
    const [req] = await getManagerRequests();
    expect(http.get).toHaveBeenCalledWith("/service-requests/admin");
    expect(req.priority).toBe("نامشخص");
    expect(req.priorityColor).toBe("muted");
    expect(req.unit).toBe("—");
  });

  it("maps requestingUnit to a display label", async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: [
        {
          ...rawRequest,
          requestingUnit: {
            unitNumber: "12",
            floorNumber: 3,
            buildingName: "برج نیلوفر",
          },
        },
      ],
    });
    const [req] = await getManagerRequests();
    expect(req.unit).toBe("۱۲ — طبقه ۳");
    expect(req.requestingUnit).toBe("۱۲ — طبقه ۳");
  });

  it("falls back to a dash when requestingUnit is missing, but keeps requestingUnit null", async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: [{ ...rawRequest, requestingUnit: null }],
    });
    const [req] = await getManagerRequests();
    expect(req.unit).toBe("—");
    expect(req.requestingUnit).toBeNull();
  });
});

describe("getAssignedRequests", () => {
  it("hits the assigned-to-me endpoint and returns raw data", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [rawRequest] });
    const result = await getAssignedRequests();
    expect(http.get).toHaveBeenCalledWith("/service-requests/assigned-to-me");
    expect(result).toEqual([rawRequest]);
  });
});

describe("getRequestCategories", () => {
  it("returns the category options", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: { groups: [] } });
    await getRequestCategories();
    expect(http.get).toHaveBeenCalledWith("/service-requests/categories");
  });
});

describe("createRequest", () => {
  it("only sends the fields the backend expects", async () => {
    vi.mocked(http.post).mockResolvedValue({ data: { id: "new-id" } });
    const result = await createRequest({
      categoryGroup: "FACILITIES",
      subCategory: "ELEVATOR",
      title: "عنوان",
      description: "توضیحات",
    });
    expect(http.post).toHaveBeenCalledWith("/service-requests", {
      title: "عنوان",
      description: "توضیحات",
      categoryGroup: "FACILITIES",
      subCategory: "ELEVATOR",
    });
    expect(result).toEqual({ id: "new-id" });
  });
});

describe("workflow actions", () => {
  it("approveRequest patches the approve endpoint", async () => {
    vi.mocked(http.patch).mockResolvedValue({ data: {} });
    await approveRequest("id-1");
    expect(http.patch).toHaveBeenCalledWith("/service-requests/id-1/approve");
  });

  it("rejectRequest patches the reject endpoint", async () => {
    vi.mocked(http.patch).mockResolvedValue({ data: {} });
    await rejectRequest("id-1");
    expect(http.patch).toHaveBeenCalledWith("/service-requests/id-1/reject");
  });

  it("assignRequest patches with a workerId query param", async () => {
    vi.mocked(http.patch).mockResolvedValue({ data: {} });
    await assignRequest("id-1", "worker-1");
    expect(http.patch).toHaveBeenCalledWith(
      "/service-requests/id-1/assign",
      undefined,
      { params: { workerId: "worker-1" } },
    );
  });

  it("startRequestProgress patches the start-progress endpoint", async () => {
    vi.mocked(http.patch).mockResolvedValue({ data: {} });
    await startRequestProgress("id-1");
    expect(http.patch).toHaveBeenCalledWith(
      "/service-requests/id-1/start-progress",
      {},
    );
  });

  it("completeRequest sends the report and cost", async () => {
    vi.mocked(http.patch).mockResolvedValue({ data: {} });
    await completeRequest("id-1", "گزارش", 50000);
    expect(http.patch).toHaveBeenCalledWith("/service-requests/id-1/complete", {
      completionReport: "گزارش",
      completionCost: 50000,
    });
  });

  it("assignCostResponsibility patches the chosen payment method", async () => {
    vi.mocked(http.patch).mockResolvedValue({ data: {} });
    await assignCostResponsibility("id-1", "ALL_UNITS");
    expect(http.patch).toHaveBeenCalledWith(
      "/service-requests/id-1/cost-responsibility",
      { costResponsibility: "ALL_UNITS" },
    );
  });
});
