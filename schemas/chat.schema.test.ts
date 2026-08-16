import { describe, expect, it } from "vitest";

import { chatMessageSchema } from "./chat.schema";

describe("chatMessageSchema", () => {
  it("accepts a non-empty message", () => {
    expect(chatMessageSchema.safeParse({ body: "سلام" }).success).toBe(true);
  });

  it("rejects an empty message", () => {
    expect(chatMessageSchema.safeParse({ body: "" }).success).toBe(false);
  });

  it("rejects a message over 4000 characters", () => {
    expect(
      chatMessageSchema.safeParse({ body: "a".repeat(4001) }).success,
    ).toBe(false);
  });

  it("trims whitespace before validating", () => {
    expect(chatMessageSchema.safeParse({ body: "   " }).success).toBe(false);
  });
});
