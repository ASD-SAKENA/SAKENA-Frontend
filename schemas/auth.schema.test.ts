import { describe, expect, it } from "vitest";

import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "./auth.schema";

describe("loginSchema", () => {
  it("accepts a username and password", () => {
    const result = loginSchema.safeParse({
      username: "moeein",
      password: "secret",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty username", () => {
    const result = loginSchema.safeParse({ username: "", password: "x" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({ username: "moeein", password: "" });
    expect(result.success).toBe(false);
  });

  it("does not require a role field", () => {
    const result = loginSchema.safeParse({
      username: "moeein",
      password: "secret",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect("role" in result.data).toBe(false);
    }
  });
});

describe("signupSchema", () => {
  const valid = {
    name: "Ali Rezaei",
    buildingCode: "SKN-1",
    email: "ali@example.com",
    password: "password123",
    role: "resident" as const,
    agree: true as const,
  };

  it("accepts a fully valid payload", () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it("does not require a mobile field", () => {
    const result = signupSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect("mobile" in result.data).toBe(false);
    }
  });

  it("rejects a name shorter than 2 characters", () => {
    expect(
      signupSchema.safeParse({ ...valid, name: "A" }).success,
    ).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(
      signupSchema.safeParse({ ...valid, email: "not-an-email" }).success,
    ).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    expect(
      signupSchema.safeParse({ ...valid, password: "short" }).success,
    ).toBe(false);
  });

  it("rejects when agree is false", () => {
    expect(
      signupSchema.safeParse({ ...valid, agree: false }).success,
    ).toBe(false);
  });

  it("allows buildingCode to be omitted", () => {
    const { buildingCode, ...rest } = valid;
    void buildingCode;
    expect(signupSchema.safeParse(rest).success).toBe(true);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts a valid email", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "a@b.com" }).success,
    ).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "not-an-email" }).success,
    ).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("accepts matching passwords", () => {
    const result = resetPasswordSchema.safeParse({
      newPassword: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = resetPasswordSchema.safeParse({
      newPassword: "password123",
      confirmPassword: "different123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["confirmPassword"]);
    }
  });

  it("rejects a new password shorter than 8 characters", () => {
    const result = resetPasswordSchema.safeParse({
      newPassword: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
  });
});
