import { describe, expect, it } from "vitest";

import {
  assignWorkerSchema,
  completeTaskSchema,
  requestSchema,
} from "./request.schema";

describe("requestSchema", () => {
  const valid = {
    categoryGroup: "FACILITIES",
    subCategory: "ELEVATOR",
    title: "آسانسور خراب است",
    description: "آسانسور بین طبقه دو و سه گیر کرده.",
  };

  it("accepts a fully filled request", () => {
    expect(requestSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an empty category group", () => {
    expect(
      requestSchema.safeParse({ ...valid, categoryGroup: "" }).success,
    ).toBe(false);
  });

  it("rejects a title shorter than 3 characters", () => {
    expect(requestSchema.safeParse({ ...valid, title: "ab" }).success).toBe(
      false,
    );
  });

  it("rejects a description shorter than 5 characters", () => {
    expect(
      requestSchema.safeParse({ ...valid, description: "abcd" }).success,
    ).toBe(false);
  });
});

describe("assignWorkerSchema", () => {
  it("accepts a valid worker uuid", () => {
    expect(
      assignWorkerSchema.safeParse({
        workerId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      }).success,
    ).toBe(true);
  });

  it("rejects a non-uuid worker id", () => {
    expect(
      assignWorkerSchema.safeParse({ workerId: "not-a-uuid" }).success,
    ).toBe(false);
  });
});

describe("completeTaskSchema", () => {
  it("accepts both fields empty (both optional)", () => {
    expect(
      completeTaskSchema.safeParse({
        completionReport: "",
        completionCost: "",
      }).success,
    ).toBe(true);
  });

  it("accepts a filled report and numeric cost", () => {
    expect(
      completeTaskSchema.safeParse({
        completionReport: "لوله تعویض شد.",
        completionCost: "150000",
      }).success,
    ).toBe(true);
  });

  it("rejects a non-numeric cost", () => {
    expect(
      completeTaskSchema.safeParse({ completionCost: "abc" }).success,
    ).toBe(false);
  });

  it("rejects a report over 4000 characters", () => {
    expect(
      completeTaskSchema.safeParse({ completionReport: "a".repeat(4001) })
        .success,
    ).toBe(false);
  });
});
