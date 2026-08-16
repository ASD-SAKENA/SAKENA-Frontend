import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("renders its children", () => {
    render(<StatusBadge color="success">فعال</StatusBadge>);
    expect(screen.getByText("فعال")).toBeInTheDocument();
  });

  it("applies a distinct color class per color prop", () => {
    const { container: success } = render(
      <StatusBadge color="success">a</StatusBadge>,
    );
    const { container: danger } = render(
      <StatusBadge color="danger">a</StatusBadge>,
    );
    expect(success.firstElementChild?.className).toContain("text-app-success");
    expect(danger.firstElementChild?.className).toContain("text-app-danger");
    expect(success.firstElementChild?.className).not.toContain(
      "text-app-danger",
    );
  });

  it("merges a custom className", () => {
    render(
      <StatusBadge color="info" className="custom-class">
        متن
      </StatusBadge>,
    );
    expect(screen.getByText("متن")).toHaveClass("custom-class");
  });
});
