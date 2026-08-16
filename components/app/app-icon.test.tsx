import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppIcon } from "./app-icon";

describe("AppIcon", () => {
  it("renders the mapped icon for a known name", () => {
    const { container } = render(<AppIcon name="dashboard" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("falls back to the error icon for an unknown name", () => {
    const known = render(<AppIcon name="dashboard" />).container.innerHTML;
    const unknown = render(<AppIcon name="totally-made-up" />).container
      .innerHTML;
    expect(unknown).not.toBe(known);
    expect(unknown).toContain("<svg");
  });

  it("applies the default size class alongside a custom className", () => {
    const { container } = render(
      <AppIcon name="dashboard" className="text-red-500" />,
    );
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toContain("size-5");
    expect(svg?.getAttribute("class")).toContain("text-red-500");
  });

  it("uses the given strokeWidth", () => {
    const { container } = render(<AppIcon name="dashboard" strokeWidth={3} />);
    expect(container.querySelector("svg")?.getAttribute("stroke-width")).toBe(
      "3",
    );
  });
});
