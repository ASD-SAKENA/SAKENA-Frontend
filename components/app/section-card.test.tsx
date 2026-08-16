import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionCard } from "./section-card";

describe("SectionCard", () => {
  it("renders children", () => {
    render(
      <SectionCard>
        <span>محتوا</span>
      </SectionCard>,
    );
    expect(screen.getByText("محتوا")).toBeInTheDocument();
  });

  it("renders the title when given", () => {
    render(
      <SectionCard title="عنوان بخش">
        <span>محتوا</span>
      </SectionCard>,
    );
    expect(screen.getByText("عنوان بخش")).toBeInTheDocument();
  });

  it("does not render the header row when neither title nor action is given", () => {
    const { container } = render(
      <SectionCard>
        <span>محتوا</span>
      </SectionCard>,
    );
    expect(container.querySelectorAll("div").length).toBe(2); // outer + body
  });

  it("renders the action alongside the title", () => {
    render(
      <SectionCard title="عنوان" action={<button>عملیات</button>}>
        <span>محتوا</span>
      </SectionCard>,
    );
    expect(screen.getByRole("button", { name: "عملیات" })).toBeInTheDocument();
  });
});
