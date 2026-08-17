import { beforeEach, describe, expect, it, vi } from "vitest";

import http from "@/services/http";

import { getStaff } from "./staff";

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

describe("getStaff", () => {
  it("fetches the manager-facing staff directory", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [] });
    await getStaff();
    expect(http.get).toHaveBeenCalledWith("/staff");
  });

  it("passes through each staff member's average rating", async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: [
        {
          id: "s1",
          username: "electrician",
          specialty: "برق",
          active: true,
          averageRating: 4.5,
        },
      ],
    });

    const staff = await getStaff();

    expect(staff[0].averageRating).toBe(4.5);
  });
});
