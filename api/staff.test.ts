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
});
