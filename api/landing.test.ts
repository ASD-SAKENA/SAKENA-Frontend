import { describe, expect, it } from "vitest";

import { getLandingContent } from "./landing";

describe("getLandingContent", () => {
  it("resolves the static landing content with the expected sections", async () => {
    const content = await getLandingContent();

    expect(content.hero).toBeDefined();
    expect(content.stats.length).toBeGreaterThan(0);
    expect(content.features.length).toBeGreaterThan(0);
    expect(content.roles.map((r) => r.key)).toEqual([
      "resident",
      "manager",
      "staff",
    ]);
    expect(content.faqs.length).toBeGreaterThan(0);
  });
});
