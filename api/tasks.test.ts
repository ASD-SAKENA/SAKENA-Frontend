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

  it("does not mark a COMPLETED request as done — it still awaits resident confirmation", async () => {
    mockedGetAssigned.mockResolvedValue([
      { ...baseRequest, status: "COMPLETED" },
    ]);
    const [task] = await getStaffTasks();
    expect(task.done).toBe(false);
  });

  it("marks a CONFIRMED request as done", async () => {
    mockedGetAssigned.mockResolvedValue([
      { ...baseRequest, status: "CONFIRMED" },
    ]);
    const [task] = await getStaffTasks();
    expect(task.done).toBe(true);
  });

  it("marks a SETTLED request as done", async () => {
    mockedGetAssigned.mockResolvedValue([
      { ...baseRequest, status: "SETTLED" },
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

    // PENDING + IN_PROGRESS are "open"; COMPLETED is awaiting confirmation
    // (neither open nor done); REJECTED and done statuses are excluded.
    expect(summary.find((s) => s.label === "کارهای باز")?.value).toBe("۲");
    expect(summary.find((s) => s.label === "در جریان")?.value).toBe("۱");
    expect(summary.find((s) => s.label === "انجام‌شده")?.value).toBe("۰");
  });

  it("does not count a COMPLETED request as done, but counts CONFIRMED and SETTLED", async () => {
    mockedGetAssigned.mockResolvedValue([
      { ...baseRequest, id: "1", status: "COMPLETED" },
      { ...baseRequest, id: "2", status: "CONFIRMED" },
      { ...baseRequest, id: "3", status: "SETTLED" },
    ]);

    const summary = await getStaffSummary();

    expect(summary.find((s) => s.label === "کارهای باز")?.value).toBe("۰");
    expect(summary.find((s) => s.label === "انجام‌شده")?.value).toBe("۲");
  });
});

describe("getStaffHistory", () => {
  it("includes CONFIRMED and SETTLED jobs, not just COMPLETED", async () => {
    mockedGetAssigned.mockResolvedValue([
      { ...baseRequest, id: "req-1", status: "COMPLETED" },
      { ...baseRequest, id: "req-2", status: "CONFIRMED" },
      { ...baseRequest, id: "req-3", status: "SETTLED" },
      { ...baseRequest, id: "req-4", status: "IN_PROGRESS" },
    ]);

    const history = await getStaffHistory();

    expect(history.map((h) => h.id).sort()).toEqual(["req-2", "req-3"]);
  });

  it("returns only CONFIRMED/SETTLED requests, newest first", async () => {
    mockedGetAssigned.mockResolvedValue([
      {
        ...baseRequest,
        id: "old",
        status: "CONFIRMED",
        resolvedAt: "2026-01-01T00:00:00Z",
      },
      { ...baseRequest, id: "open", status: "PENDING" },
      {
        ...baseRequest,
        id: "new",
        status: "SETTLED",
        resolvedAt: "2026-03-01T00:00:00Z",
      },
    ]);

    const history = await getStaffHistory();

    expect(history.map((h) => h.id)).toEqual(["new", "old"]);
  });

  it("falls back to a placeholder when there is no completion report", async () => {
    mockedGetAssigned.mockResolvedValue([
      { ...baseRequest, status: "CONFIRMED", resolvedAt: "2026-01-01" },
    ]);
    const [item] = await getStaffHistory();
    expect(item.report).toBe("گزارشی ثبت نشده است");
    expect(item.cost).toBeNull();
  });
});
