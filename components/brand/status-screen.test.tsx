import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusScreen } from "./status-screen";

describe("StatusScreen", () => {
  it("renders the title", () => {
    render(<StatusScreen title="صفحه پیدا نشد" />);
    expect(screen.getByText("صفحه پیدا نشد")).toBeInTheDocument();
  });

  it("renders the badge, description and children when given", () => {
    render(
      <StatusScreen title="خطا" badge="۴۰۴" description="توضیحات خطا">
        <button>بازگشت</button>
      </StatusScreen>,
    );
    expect(screen.getByText("۴۰۴")).toBeInTheDocument();
    expect(screen.getByText("توضیحات خطا")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "بازگشت" })).toBeInTheDocument();
  });

  it("omits optional sections when not given", () => {
    render(<StatusScreen title="خطا" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
