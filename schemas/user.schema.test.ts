import { describe, expect, it } from "vitest";

import { specialtySchema } from "./user.schema";

describe("specialtySchema", () => {
  it("accepts a valid specialty", () => {
    expect(specialtySchema.safeParse({ specialty: "برق‌کاری" }).success).toBe(
      true,
    );
  });

  it("rejects a specialty shorter than 2 characters", () => {
    expect(specialtySchema.safeParse({ specialty: "ب" }).success).toBe(false);
  });

  it("rejects a specialty longer than 100 characters", () => {
    expect(
      specialtySchema.safeParse({ specialty: "a".repeat(101) }).success,
    ).toBe(false);
  });
});
