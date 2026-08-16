import { afterEach, describe, expect, it, vi } from "vitest";

import { ss } from "./session-storage";

describe("ss", () => {
  afterEach(() => {
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("round-trips a value through set/get", () => {
    ss.set("key", "value");
    expect(ss.get("key")).toBe("value");
  });

  it("returns null for a missing key", () => {
    expect(ss.get("missing")).toBeNull();
  });

  it("removes a key", () => {
    ss.set("key", "value");
    ss.remove("key");
    expect(ss.get("key")).toBeNull();
  });

  it("swallows a SecurityError on get instead of throwing", () => {
    vi.spyOn(window.sessionStorage, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    expect(ss.get("key")).toBeNull();
  });

  it("swallows a SecurityError on set instead of throwing", () => {
    vi.spyOn(window.sessionStorage, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    expect(() => ss.set("key", "value")).not.toThrow();
  });
});
