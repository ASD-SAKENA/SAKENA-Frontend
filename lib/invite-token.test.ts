import { describe, expect, it } from "vitest";

import { extractInviteToken } from "./invite-token";

describe("extractInviteToken", () => {
  it("reads the token query param from a join URL", () => {
    expect(
      extractInviteToken("https://app.sakena.ir/join?token=abc_123-XYZ"),
    ).toBe("abc_123-XYZ");
  });

  it("accepts a bare token", () => {
    expect(extractInviteToken("abc_123-XYZ")).toBe("abc_123-XYZ");
  });

  it("rejects empty or garbage input", () => {
    expect(extractInviteToken("")).toBeNull();
    expect(extractInviteToken("not a token")).toBeNull();
    expect(extractInviteToken("https://app.sakena.ir/join")).toBeNull();
  });
});
