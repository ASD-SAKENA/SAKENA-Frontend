import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { KpiCard } from "./kpi-card";

describe("KpiCard", () => {
  it("renders label and value", () => {
    render(
      <KpiCard
        label="مانده کیف پول"
        value="۵۰۰,۰۰۰"
        icon="wallet"
        color="gold"
      />,
    );
    expect(screen.getByText("مانده کیف پول")).toBeInTheDocument();
    expect(screen.getByText("۵۰۰,۰۰۰")).toBeInTheDocument();
  });

  it("omits the sub line when not given", () => {
    render(<KpiCard label="x" value="1" icon="wallet" color="gold" />);
    expect(screen.queryByText("تومان")).not.toBeInTheDocument();
  });

  it("renders the sub line when given", () => {
    render(
      <KpiCard label="x" value="1" icon="wallet" color="gold" sub="تومان" />,
    );
    expect(screen.getByText("تومان")).toBeInTheDocument();
  });
});
