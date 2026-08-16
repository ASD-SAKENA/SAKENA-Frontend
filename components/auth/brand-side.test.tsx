import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandSide } from "./brand-side";

describe("BrandSide", () => {
  it("renders the brand points and stats", () => {
    render(<BrandSide />);
    expect(
      screen.getByText("پرداخت شارژ و مدیریت مالی شفاف"),
    ).toBeInTheDocument();
    expect(screen.getByText("۴۸+")).toBeInTheDocument();
    expect(screen.getByText("نرخ وصول")).toBeInTheDocument();
  });
});
