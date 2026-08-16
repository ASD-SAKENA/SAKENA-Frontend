import { beforeEach, describe, expect, it, vi } from "vitest";

import http from "@/services/http";

import { getUsers, updateUserSpecialty, updateUserStatus } from "./users";

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

describe("getUsers", () => {
  it("omits the role param when not given", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [] });
    await getUsers();
    expect(http.get).toHaveBeenCalledWith("/users", { params: undefined });
  });

  it("filters by role when given", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [] });
    await getUsers("STAFF");
    expect(http.get).toHaveBeenCalledWith("/users", {
      params: { role: "STAFF" },
    });
  });
});

describe("updateUserStatus", () => {
  it("patches the active flag", async () => {
    vi.mocked(http.patch).mockResolvedValue({ data: { id: "u1" } });
    await updateUserStatus("u1", false);
    expect(http.patch).toHaveBeenCalledWith("/users/u1/status", {
      active: false,
    });
  });
});

describe("updateUserSpecialty", () => {
  it("patches the specialty", async () => {
    vi.mocked(http.patch).mockResolvedValue({ data: { id: "u1" } });
    await updateUserSpecialty("u1", "برق‌کاری");
    expect(http.patch).toHaveBeenCalledWith("/users/u1/specialty", {
      specialty: "برق‌کاری",
    });
  });

  it("allows clearing the specialty with null", async () => {
    vi.mocked(http.patch).mockResolvedValue({ data: { id: "u1" } });
    await updateUserSpecialty("u1", null);
    expect(http.patch).toHaveBeenCalledWith("/users/u1/specialty", {
      specialty: null,
    });
  });
});
