import { describe, expect, it } from "vitest";

import { apartmentSchema, buildingSchema } from "./units.schema";

describe("buildingSchema", () => {
  it("accepts a valid building", () => {
    const result = buildingSchema.safeParse({
      name: "برج نیلوفر",
      address: "تهران، خیابان ولیعصر، پلاک ۱۲۰",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    expect(
      buildingSchema.safeParse({ name: "ا", address: "آدرس کامل تست" }).success,
    ).toBe(false);
  });

  it("rejects an address shorter than 5 characters", () => {
    expect(
      buildingSchema.safeParse({ name: "برج نیلوفر", address: "کم" }).success,
    ).toBe(false);
  });
});

describe("apartmentSchema", () => {
  const valid = {
    buildingId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    unitNumber: "12",
    floorNumber: "3",
    areaSquareMeters: "85.5",
    bedrooms: "2",
  };

  it("accepts valid input and coerces numeric strings", () => {
    const result = apartmentSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.floorNumber).toBe(3);
      expect(result.data.areaSquareMeters).toBe(85.5);
      expect(result.data.bedrooms).toBe(2);
    }
  });

  it("accepts Persian digit numeric fields", () => {
    const result = apartmentSchema.safeParse({
      ...valid,
      floorNumber: "۳",
      areaSquareMeters: "۸۵.۵",
      bedrooms: "۲",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.floorNumber).toBe(3);
      expect(result.data.areaSquareMeters).toBe(85.5);
      expect(result.data.bedrooms).toBe(2);
    }
  });

  it("rejects a non-uuid buildingId", () => {
    expect(
      apartmentSchema.safeParse({ ...valid, buildingId: "not-a-uuid" }).success,
    ).toBe(false);
  });

  it("rejects a negative floor number", () => {
    expect(
      apartmentSchema.safeParse({ ...valid, floorNumber: "-1" }).success,
    ).toBe(false);
  });

  it("rejects a non-positive area", () => {
    expect(
      apartmentSchema.safeParse({ ...valid, areaSquareMeters: "0" }).success,
    ).toBe(false);
  });

  it("rejects a fractional floor number", () => {
    expect(
      apartmentSchema.safeParse({ ...valid, floorNumber: "1.5" }).success,
    ).toBe(false);
  });

  it("rejects bedrooms above 20", () => {
    expect(
      apartmentSchema.safeParse({ ...valid, bedrooms: "21" }).success,
    ).toBe(false);
  });

  it("rejects a non-numeric unit number field being empty", () => {
    expect(
      apartmentSchema.safeParse({ ...valid, unitNumber: "" }).success,
    ).toBe(false);
  });
});
