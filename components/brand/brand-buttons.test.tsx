import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandLink } from "./brand-buttons";

describe("BrandLink", () => {
  it("renders a link to the given href", () => {
    render(<BrandLink href="/login">ورود</BrandLink>);
    const link = screen.getByRole("link", { name: "ورود" });
    expect(link).toHaveAttribute("href", "/login");
  });

  it("defaults to the gold variant", () => {
    render(<BrandLink href="/login">ورود</BrandLink>);
    expect(screen.getByRole("link").className).toContain("font-bold");
  });

  it("applies the outline variant when given", () => {
    render(
      <BrandLink href="/signup" variant="outline">
        ثبت‌نام
      </BrandLink>,
    );
    expect(screen.getByRole("link").className).toContain("font-semibold");
  });
});
