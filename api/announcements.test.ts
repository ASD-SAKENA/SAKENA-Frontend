import { beforeEach, describe, expect, it, vi } from "vitest";

import http from "@/services/http";

import { createAnnouncement, getAnnouncements } from "./announcements";

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

describe("getAnnouncements", () => {
  it("rotates icon/color accents by index, cycling after 4", async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: Array.from({ length: 5 }, (_, i) => ({
        id: `a${i}`,
        title: `عنوان ${i}`,
        body: `متن ${i}`,
        createdAt: "2026-01-01T00:00:00Z",
      })),
    });

    const announcements = await getAnnouncements();

    expect(http.get).toHaveBeenCalledWith("/announcements");
    expect(announcements[0].icon).toBe(announcements[4].icon); // cycles at 4
    expect(announcements[0].icon).not.toBe(announcements[1].icon);
  });
});

describe("createAnnouncement", () => {
  it("posts the payload and returns the new id", async () => {
    vi.mocked(http.post).mockResolvedValue({ data: { id: "ann-1" } });
    const result = await createAnnouncement({
      title: "عنوان",
      body: "متن اطلاعیه",
    });
    expect(http.post).toHaveBeenCalledWith("/announcements", {
      title: "عنوان",
      body: "متن اطلاعیه",
    });
    expect(result).toEqual({ id: "ann-1" });
  });
});
