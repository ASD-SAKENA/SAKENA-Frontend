import { beforeEach, describe, expect, it, vi } from "vitest";

import http from "@/services/http";

import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "./notifications";

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

describe("getNotifications", () => {
  it("loads the notification list", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [{ id: "n1" }] });
    expect(await getNotifications()).toEqual([{ id: "n1" }]);
    expect(http.get).toHaveBeenCalledWith("/notifications");
  });
});

describe("getUnreadNotificationCount", () => {
  it("returns the unread count field", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: { count: 3 } });
    expect(await getUnreadNotificationCount()).toBe(3);
    expect(http.get).toHaveBeenCalledWith("/notifications/unread-count");
  });
});

describe("markNotificationRead / markAllNotificationsRead", () => {
  it("marks one notification as read", async () => {
    vi.mocked(http.post).mockResolvedValue({ data: { id: "n1", unread: false } });
    expect(await markNotificationRead("n1")).toEqual({ id: "n1", unread: false });
    expect(http.post).toHaveBeenCalledWith("/notifications/n1/read");
  });

  it("marks every notification as read", async () => {
    vi.mocked(http.post).mockResolvedValue({ data: undefined });
    await markAllNotificationsRead();
    expect(http.post).toHaveBeenCalledWith("/notifications/read-all");
  });
});
