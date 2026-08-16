import { describe, expect, it } from "vitest";

import { invitationSchema } from "./invitation.schema";

describe("invitationSchema", () => {
  it("accepts a valid EMAIL invitation", () => {
    const result = invitationSchema.safeParse({
      channel: "EMAIL",
      recipient: "resident@example.com",
      role: "RESIDENT",
      apartmentId: "unit-1",
      tenancy: "TENANT",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an EMAIL invitation with an invalid email", () => {
    const result = invitationSchema.safeParse({
      channel: "EMAIL",
      recipient: "not-an-email",
      role: "RESIDENT",
      tenancy: "TENANT",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["recipient"]);
    }
  });

  it("accepts a valid PHONE invitation", () => {
    const result = invitationSchema.safeParse({
      channel: "PHONE",
      recipient: "09121234567",
      role: "RESIDENT",
      tenancy: "TENANT",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a PHONE invitation with an invalid number", () => {
    const result = invitationSchema.safeParse({
      channel: "PHONE",
      recipient: "12345",
      role: "RESIDENT",
      tenancy: "TENANT",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["recipient"]);
    }
  });

  it("accepts a LINK invitation without a recipient", () => {
    const result = invitationSchema.safeParse({
      channel: "LINK",
      role: "RESIDENT",
      tenancy: "TENANT",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a STAFF invitation that carries an apartmentId", () => {
    const result = invitationSchema.safeParse({
      channel: "LINK",
      role: "STAFF",
      apartmentId: "unit-1",
      tenancy: "TENANT",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["apartmentId"]);
    }
  });

  it("accepts a STAFF invitation without an apartmentId", () => {
    const result = invitationSchema.safeParse({
      channel: "LINK",
      role: "STAFF",
      tenancy: "TENANT",
    });
    expect(result.success).toBe(true);
  });
});
