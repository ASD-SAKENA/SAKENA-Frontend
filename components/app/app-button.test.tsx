import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AppButton } from "./app-button";

describe("AppButton", () => {
  it("renders its children and defaults to type=button", () => {
    render(<AppButton>ارسال</AppButton>);
    const button = screen.getByRole("button", { name: "ارسال" });
    expect(button).toHaveAttribute("type", "button");
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<AppButton onClick={onClick}>کلیک کن</AppButton>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("respects an explicit type", () => {
    render(<AppButton type="submit">ثبت</AppButton>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("does not fire onClick while disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <AppButton onClick={onClick} disabled>
        غیرفعال
      </AppButton>,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies a distinct class per variant", () => {
    render(<AppButton variant="outline">outline</AppButton>);
    render(<AppButton variant="ghost">ghost</AppButton>);
    const outline = screen.getByRole("button", { name: "outline" });
    const ghost = screen.getByRole("button", { name: "ghost" });
    expect(outline.className).not.toBe(ghost.className);
  });
});
