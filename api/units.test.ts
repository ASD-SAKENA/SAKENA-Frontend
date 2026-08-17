import { beforeEach, describe, expect, it, vi } from "vitest";

import http from "@/services/http";

import {
  createApartment,
  deleteApartment,
  getBuildings,
  getUnits,
  updateApartment,
  updateBuilding,
} from "./units";

vi.mock("@/services/http", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const rawApartment = {
  id: "apt-1",
  buildingId: "b1",
  unitNumber: "12",
  floorNumber: 3,
  areaSquareMeters: 85,
  bedrooms: 2,
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getUnits", () => {
  it("maps apartments to display units with Persian digits", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [rawApartment] });
    const [unit] = await getUnits();
    expect(http.get).toHaveBeenCalledWith("/apartments", { params: undefined });
    expect(unit.no).toBe("۱۲");
    expect(unit.tenancy).toBe("طبقه ۳ · ۲ خوابه");
  });

  it("filters by buildingId when given", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [] });
    await getUnits("b1");
    expect(http.get).toHaveBeenCalledWith("/apartments", {
      params: { buildingId: "b1" },
    });
  });
});

describe("apartment mutations", () => {
  it("createApartment posts and maps the response", async () => {
    vi.mocked(http.post).mockResolvedValue({ data: rawApartment });
    const unit = await createApartment({
      buildingId: "b1",
      unitNumber: "12",
      floorNumber: 3,
      areaSquareMeters: 85,
      bedrooms: 2,
    });
    expect(http.post).toHaveBeenCalledWith("/apartments", expect.any(Object));
    expect(unit.id).toBe("apt-1");
  });

  it("updateApartment puts to the apartment's route", async () => {
    vi.mocked(http.put).mockResolvedValue({ data: rawApartment });
    await updateApartment("apt-1", {
      buildingId: "b1",
      unitNumber: "12",
      floorNumber: 3,
      areaSquareMeters: 85,
      bedrooms: 2,
    });
    expect(http.put).toHaveBeenCalledWith(
      "/apartments/apt-1",
      expect.any(Object),
    );
  });

  it("deleteApartment deletes by id", async () => {
    vi.mocked(http.delete).mockResolvedValue({ data: {} });
    await deleteApartment("apt-1");
    expect(http.delete).toHaveBeenCalledWith("/apartments/apt-1");
  });
});

describe("building mutations", () => {
  it("getBuildings reads the building list", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [] });
    await getBuildings();
    expect(http.get).toHaveBeenCalledWith("/buildings");
  });

  it("updateBuilding puts to the building's route", async () => {
    vi.mocked(http.put).mockResolvedValue({ data: { id: "b1" } });
    const payload = { name: "برج نیلوفر", address: "تهران" };
    await updateBuilding("b1", payload);
    expect(http.put).toHaveBeenCalledWith("/buildings/b1", payload);
  });
});
