import { describe, expect, it } from "vitest";

import { paymentSchema, topUpSchema } from "./wallet.schema";

describe("paymentSchema", () => {
  it("accepts a valid title and amount", () => {
    const result = paymentSchema.safeParse({
      title: "شارژ تیرماه",
      amount: "850000",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a title shorter than 3 characters", () => {
    expect(
      paymentSchema.safeParse({ title: "ab", amount: "100" }).success,
    ).toBe(false);
  });

  it("rejects a non-numeric amount", () => {
    expect(
      paymentSchema.safeParse({ title: "شارژ", amount: "abc" }).success,
    ).toBe(false);
  });

  it("rejects a zero amount", () => {
    expect(
      paymentSchema.safeParse({ title: "شارژ", amount: "0" }).success,
    ).toBe(false);
  });

  it("rejects a negative-looking amount (regex requires digits only)", () => {
    expect(
      paymentSchema.safeParse({ title: "شارژ", amount: "-100" }).success,
    ).toBe(false);
  });
});

describe("topUpSchema", () => {
  it("accepts a positive numeric amount", () => {
    expect(topUpSchema.safeParse({ amount: "500000" }).success).toBe(true);
  });

  it("rejects a zero amount", () => {
    expect(topUpSchema.safeParse({ amount: "0" }).success).toBe(false);
  });

  it("rejects a non-numeric amount", () => {
    expect(topUpSchema.safeParse({ amount: "abc" }).success).toBe(false);
  });

  it("rejects an empty amount", () => {
    expect(topUpSchema.safeParse({ amount: "" }).success).toBe(false);
  });
});
