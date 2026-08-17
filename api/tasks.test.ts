import { beforeEach, describe, expect, it, vi } from "vitest";

import { getAssignedRequests } from "@/api/requests";

import { getStaffHistory, getStaffSummary, getStaffTasks } from "./tasks";

vi.mock("@/api/requests", () => ({
  getAssignedRequests: vi.fn(),
}));

const mockedGetAssigned = vi.mocked(getAssignedRequests);

const baseRequest = {
  id: "r1",
  categoryGroup: "FACILITIES",
  subCategory: "ELEVATOR",
  title: "آسانسور",
  description: "",
  status: "PENDING",
  location: "واحد ۵",
  createdBy: "resident-1",
  updatedBy: "resident-1",
  createdAt: "2026-03-01T00:00:00Z",
  updatedAt: "2026-03-01T00:00:00Z",
  assignedTo: null,
  resolvedAt: null,
  expectedCompletionAt: null,
  completionReport: null,
  completionCost: null,
  requestingUnit: null,
} as const;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getStaffTasks", () => {
  it("shows an honest 'نامشخص' priority instead of a fabricated level", async () => {
    mockedGetAssigned.mockResolvedValue([baseRequest]);
    const [task] = await getStaffTasks();
    expect(task.priority).toBe("نامشخص");
    expect(task.priorityColor).toBe("muted");
    expect(task.done).toBe(false);
  });

  it("marks a COMPLETED request as done", async () => {
    mockedGetAssigned.mockResolvedValue([
      { ...baseRequest, status: "COMPLETED" },
    ]);
    const [task] = await getStaffTasks();
    expect(task.done).toBe(true);
  });
});

describe("getStaffSummary", () => {
  it("counts open, in-progress and done requests", async () => {
    mockedGetAssigned.mockResolvedValue([
      { ...baseRequest, id: "1", status: "PENDING" },
      { ...baseRequest, id: "2", status: "IN_PROGRESS" },
      { ...baseRequest, id: "3", status: "COMPLETED" },
      { ...baseRequest, id: "4", status: "REJECTED" },
    ]);

    const summary = await getStaffSummary();

    expect(summary.find((s) => s.label === "کارهای باز")?.value).toBe("۲"); // PENDING + IN_PROGRESS
    expect(summary.find((s) => s.label === "در جریان")?.value).toBe("۱");
    expect(summary.find((s) => s.label === "انجام‌شده")?.value).toBe("۱");
  });
});

describe("getStaffHistory", () => {
  it("returns only completed requests, newest first", async () => {
    mockedGetAssigned.mockResolvedValue([
      {
        ...baseRequest,
        id: "old",
        status: "COMPLETED",
        resolvedAt: "2026-01-01T00:00:00Z",
      },
      { ...baseRequest, id: "open", status: "PENDING" },
      {
        ...baseRequest,
        id: "new",
        status: "COMPLETED",
        resolvedAt: "2026-03-01T00:00:00Z",
      },
    ]);

    const history = await getStaffHistory();

    expect(history.map((h) => h.id)).toEqual(["new", "old"]);
  });

  it("falls back to a placeholder when there is no completion report", async () => {
    mockedGetAssigned.mockResolvedValue([
      { ...baseRequest, status: "COMPLETED", resolvedAt: "2026-01-01" },
    ]);
    const [item] = await getStaffHistory();
    expect(item.report).toBe("گزارشی ثبت نشده است");
    expect(item.cost).toBeNull();
  });
});
