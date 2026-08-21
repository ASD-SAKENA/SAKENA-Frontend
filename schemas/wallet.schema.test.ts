import { describe, expect, it } from "vitest";

import {
  invoicePaymentSchema,
  rejectPaymentSchema,
  topUpSchema,
} from "./wallet.schema";

describe("invoicePaymentSchema", () => {
  it("accepts amount and transaction reference", () => {
    const result = invoicePaymentSchema.safeParse({
      amount: "150000",
      transactionReference: "TRX-12345",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a short transaction reference", () => {
    expect(
      invoicePaymentSchema.safeParse({
        amount: "100",
        transactionReference: "ab",
      }).success,
    ).toBe(false);
  });

  it("rejects a non-numeric amount", () => {
    expect(
      invoicePaymentSchema.safeParse({
        amount: "abc",
        transactionReference: "TRX-12345",
      }).success,
    ).toBe(false);
  });

  it("rejects zero amount", () => {
    expect(
      invoicePaymentSchema.safeParse({
        amount: "0",
        transactionReference: "TRX-12345",
      }).success,
    ).toBe(false);
  });
});

describe("topUpSchema", () => {
  it("accepts a positive integer amount", () => {
    expect(topUpSchema.safeParse({ amount: "500000" }).success).toBe(true);
  });

  it("rejects an empty amount", () => {
    expect(topUpSchema.safeParse({ amount: "" }).success).toBe(false);
  });
});

describe("rejectPaymentSchema", () => {
  it("requires a reason", () => {
    expect(rejectPaymentSchema.safeParse({ reason: "ab" }).success).toBe(false);
    expect(
      rejectPaymentSchema.safeParse({ reason: "مبلغ اشتباه است" }).success,
    ).toBe(true);
  });
});
