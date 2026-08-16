import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RoleChips } from "./role-chips";

describe("RoleChips", () => {
  it("renders one chip per role", () => {
    render(<RoleChips value="resident" onChange={vi.fn()} />);
    expect(screen.getByText("ساکن")).toBeInTheDocument();
    expect(screen.getByText("مدیر")).toBeInTheDocument();
    expect(screen.getByText("کارکن")).toBeInTheDocument();
  });

  it("calls onChange with the clicked role", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<RoleChips value="resident" onChange={onChange} />);
    await user.click(screen.getByText("مدیر"));
    expect(onChange).toHaveBeenCalledWith("manager");
  });

  it("highlights the active chip", () => {
    render(<RoleChips value="staff" onChange={vi.fn()} />);
    const activeButton = screen.getByText("کارکن").closest("button");
    const inactiveButton = screen.getByText("ساکن").closest("button");
    expect(activeButton?.className).toContain("border-[var(--sk-gold)]");
    expect(inactiveButton?.className).not.toContain("border-[var(--sk-gold)]");
  });
});
