import { describe, expect, it } from "vitest";

import { navForRole, pageMetaForPath, roleHomePath } from "./app-nav";

describe("navForRole", () => {
  it("gives residents a profile entry", () => {
    const hrefs = navForRole("resident").map((item) => item.href);
    expect(hrefs).toContain("/profile");
  });

  it("gives staff a profile entry", () => {
    const hrefs = navForRole("staff").map((item) => item.href);
    expect(hrefs).toContain("/profile");
  });

  it("gives managers a profile entry too", () => {
    const hrefs = navForRole("manager").map((item) => item.href);
    expect(hrefs).toContain("/profile");
  });

  it("every item has a unique href within a role's nav", () => {
    for (const role of ["resident", "manager", "staff"] as const) {
      const hrefs = navForRole(role).map((item) => item.href);
      expect(new Set(hrefs).size).toBe(hrefs.length);
    }
  });
});

describe("roleHomePath", () => {
  it("sends managers to the dashboard", () => {
    expect(roleHomePath("manager")).toBe("/dashboard");
  });

  it("sends staff to their task list", () => {
    expect(roleHomePath("staff")).toBe("/tasks");
  });

  it("sends residents to the dashboard", () => {
    expect(roleHomePath("resident")).toBe("/dashboard");
  });
});

describe("pageMetaForPath", () => {
  it("returns the known title/crumb pair for a mapped route", () => {
    expect(pageMetaForPath("/wallet")).toEqual([
      "کیف پول و پرداخت",
      "مالی · موجودی و تاریخچه تراکنش‌ها",
    ]);
  });

  it("falls back to a generic title for an unmapped route", () => {
    expect(pageMetaForPath("/unknown-route")).toEqual(["ساکنا", ""]);
  });

  it("has a meta entry for every route navForRole can point to", () => {
    for (const role of ["resident", "manager", "staff"] as const) {
      for (const item of navForRole(role)) {
        expect(pageMetaForPath(item.href)[0]).not.toBe("ساکنا");
      }
    }
  });
});
