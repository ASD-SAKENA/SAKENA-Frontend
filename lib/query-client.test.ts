import { describe, expect, it } from "vitest";

import { getQueryClient } from "./query-client";

describe("getQueryClient", () => {
  it("returns a QueryClient with retries disabled for mutations", () => {
    const client = getQueryClient();
    expect(client.getDefaultOptions().mutations?.retry).toBe(false);
  });

  it("returns the same instance on repeated calls in a browser-like environment", () => {
    expect(getQueryClient()).toBe(getQueryClient());
  });
});
