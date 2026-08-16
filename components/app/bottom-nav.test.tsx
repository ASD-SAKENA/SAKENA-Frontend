import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildAppUser, useAuthStore } from "@/stores/auth.store";

import { BottomNav } from "./bottom-nav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/tasks",
}));

beforeEach(() => {
  useAuthStore.setState({ isAuthenticated: false, user: null, token: null });
});

describe("BottomNav", () => {
  it("shows at most 4 items", () => {
    useAuthStore.setState({ user: buildAppUser("manager", "مدیر") });
    render(<BottomNav />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeLessThanOrEqual(4);
  });

  it("defaults to the resident nav when there is no signed-in user", () => {
    render(<BottomNav />);
    expect(screen.getByText("داشبورد")).toBeInTheDocument();
  });

  it("highlights the item matching the current pathname", () => {
    useAuthStore.setState({ user: buildAppUser("staff", "کارکن") });
    render(<BottomNav />);
    const tasksLink = screen.getByText("وظایف من").closest("a");
    expect(tasksLink?.className).toContain("text-app-gold");
  });
});
