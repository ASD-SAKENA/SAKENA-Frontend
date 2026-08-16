import { afterEach, describe, expect, it, vi } from "vitest";

import { ls, persistStorage } from "./local-storage";

describe("ls", () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("round-trips a value through set/get", () => {
    ls.set("key", "value");
    expect(ls.get("key")).toBe("value");
  });

  it("returns null for a missing key", () => {
    expect(ls.get("missing")).toBeNull();
  });

  it("removes a key", () => {
    ls.set("key", "value");
    ls.remove("key");
    expect(ls.get("key")).toBeNull();
  });

  it("swallows a SecurityError on get instead of throwing", () => {
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    expect(ls.get("key")).toBeNull();
  });

  it("swallows a SecurityError on set instead of throwing", () => {
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    expect(() => ls.set("key", "value")).not.toThrow();
  });

  it("swallows a SecurityError on remove instead of throwing", () => {
    vi.spyOn(window.localStorage, "removeItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    expect(() => ls.remove("key")).not.toThrow();
  });
});

describe("persistStorage", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("adapts ls to the zustand StateStorage shape", () => {
    persistStorage.setItem("zustand-key", "42");
    expect(persistStorage.getItem("zustand-key")).toBe("42");
    persistStorage.removeItem("zustand-key");
    expect(persistStorage.getItem("zustand-key")).toBeNull();
  });
});
