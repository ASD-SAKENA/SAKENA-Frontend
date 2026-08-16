import { beforeEach, describe, expect, it, vi } from "vitest";

import http from "@/services/http";

import {
  endResidency,
  getBuildingResidencies,
  getMyResidency,
  startResidency,
} from "./residency";

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

describe("getMyResidency", () => {
  it("returns null for an unassigned resident (empty body)", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: "" });
    expect(await getMyResidency()).toBeNull();
  });

  it("returns the residency object when assigned", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: { id: "res-1" } });
    expect(await getMyResidency()).toEqual({ id: "res-1" });
  });
});

describe("getBuildingResidencies", () => {
  it("omits the buildingId param when null (all buildings)", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [] });
    await getBuildingResidencies(null);
    expect(http.get).toHaveBeenCalledWith("/residencies", {
      params: undefined,
    });
  });

  it("includes the buildingId param when given", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [] });
    await getBuildingResidencies("building-1");
    expect(http.get).toHaveBeenCalledWith("/residencies", {
      params: { buildingId: "building-1" },
    });
  });
});

describe("startResidency", () => {
  it("posts to the apartment's residency endpoint", async () => {
    vi.mocked(http.post).mockResolvedValue({ data: { id: "res-1" } });
    await startResidency("apt-1", {
      residentId: "user-1",
      tenancy: "TENANT",
    });
    expect(http.post).toHaveBeenCalledWith("/residencies/apartments/apt-1", {
      residentId: "user-1",
      tenancy: "TENANT",
    });
  });
});

describe("endResidency", () => {
  it("deletes the apartment's current residency", async () => {
    vi.mocked(http.delete).mockResolvedValue({ data: { id: "res-1" } });
    await endResidency("apt-1");
    expect(http.delete).toHaveBeenCalledWith("/residencies/apartments/apt-1");
  });
});
