import { describe, expect, it } from "vitest";

import { changePasswordSchema, profileSchema } from "./profile.schema";

describe("profileSchema", () => {
  const valid = { name: "Ali Rezaei", email: "ali@example.com", unit: "12" };

  it("accepts a valid profile", () => {
    expect(profileSchema.safeParse(valid).success).toBe(true);
  });

  it("does not require a mobile field", () => {
    const result = profileSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect("mobile" in result.data).toBe(false);
    }
  });

  it("rejects a name shorter than 2 characters", () => {
    expect(profileSchema.safeParse({ ...valid, name: "A" }).success).toBe(
      false,
    );
  });

  it("rejects an invalid email", () => {
    expect(profileSchema.safeParse({ ...valid, email: "bad" }).success).toBe(
      false,
    );
  });

  it("rejects an empty unit", () => {
    expect(profileSchema.safeParse({ ...valid, unit: "" }).success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("accepts valid current and new passwords", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "old",
      newPassword: "newpassword1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty current password", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "",
      newPassword: "newpassword1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a new password shorter than 8 characters", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "old",
      newPassword: "short",
    });
    expect(result.success).toBe(false);
  });
});
