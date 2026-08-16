import { describe, expect, it } from "vitest";

import { toQueryString } from "./query-string";

describe("toQueryString", () => {
  it("returns an empty string for no params", () => {
    expect(toQueryString({})).toBe("");
  });

  it("skips null and undefined values", () => {
    expect(toQueryString({ a: null, b: undefined, c: "x" })).toBe("?c=x");
  });

  it("skips empty strings and false booleans", () => {
    expect(toQueryString({ a: "", b: false, c: "x" })).toBe("?c=x");
  });

  it("renders true as the literal string 'true'", () => {
    expect(toQueryString({ a: true })).toBe("?a=true");
  });

  it("expands arrays into repeated keys", () => {
    const qs = toQueryString({ ids: ["1", "2", "3"] });
    expect(qs).toBe("?ids=1&ids=2&ids=3");
  });

  it("stringifies numbers", () => {
    expect(toQueryString({ page: 2 })).toBe("?page=2");
  });
});
