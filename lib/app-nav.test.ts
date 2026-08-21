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

  it("lets a manager review pending resident payments", () => {
    expect(navForRole("manager").map((item) => item.href)).toContain(
      "/payments",
    );
  });

  it("lets a manager reach announcements, since only they can publish one", () => {
    // The page hides its publish button behind the manager role, so without a
    // nav entry the feature existed but nobody could open it.
    expect(navForRole("manager").map((item) => item.href)).toContain(
      "/announcements",
    );
  });

  it("shows announcements to residents and managers, not staff", () => {
    expect(navForRole("resident").map((item) => item.href)).toContain(
      "/announcements",
    );
    expect(navForRole("manager").map((item) => item.href)).toContain(
      "/announcements",
    );
    expect(navForRole("staff").map((item) => item.href)).not.toContain(
      "/announcements",
    );
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
      "مالی · صورت‌حساب واحد و پرداخت",
    ]);
  });

  it("maps the manager payment review route", () => {
    expect(pageMetaForPath("/payments")).toEqual([
      "بررسی پرداخت‌ها",
      "مالی · تایید یا رد رسیدهای بانکی ساکنین",
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
