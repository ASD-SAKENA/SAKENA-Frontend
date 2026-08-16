import { describe, expect, it } from "vitest";

import { organizationJsonLd, websiteJsonLd } from "./seo";

describe("organizationJsonLd", () => {
  it("produces a valid schema.org Organization node", () => {
    const jsonLd = organizationJsonLd();
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("Organization");
    expect(jsonLd.name).toBe("ساکنا");
    expect(jsonLd.url).toBeTruthy();
    expect(jsonLd.logo).toContain(jsonLd.url);
  });
});

describe("websiteJsonLd", () => {
  it("produces a valid schema.org WebSite node", () => {
    const jsonLd = websiteJsonLd();
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("WebSite");
    expect(jsonLd.inLanguage).toBe("fa-IR");
  });
});
