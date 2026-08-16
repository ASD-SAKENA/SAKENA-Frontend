import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAppUiStore } from "@/stores/app-ui.store";
import { buildAppUser, useAuthStore } from "@/stores/auth.store";

import { AppSidebar } from "./app-sidebar";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ push }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState({
    isAuthenticated: true,
    user: buildAppUser("manager", "مریم احمدی"),
    token: "t",
  });
  useAppUiStore.setState({ navOpen: false });
});

describe("AppSidebar", () => {
  it("renders the manager's nav items, including the profile entry", () => {
    render(<AppSidebar />);
    expect(screen.getByText("داشبورد")).toBeInTheDocument();
    expect(screen.getByText("پروفایل")).toBeInTheDocument();
  });

  it("shows the signed-in user's name and role", () => {
    render(<AppSidebar />);
    expect(screen.getByText("مریم احمدی")).toBeInTheDocument();
    expect(screen.getByText("مدیر ساختمان")).toBeInTheDocument();
  });

  it("logs out and redirects to /login on the logout button", async () => {
    const user = userEvent.setup();
    render(<AppSidebar />);
    await user.click(screen.getByTitle("خروج"));
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(push).toHaveBeenCalledWith("/login");
  });

  it("highlights the active nav item for the current pathname", () => {
    render(<AppSidebar />);
    const dashboardLink = screen.getByText("داشبورد").closest("a");
    expect(dashboardLink?.className).toContain("text-app-gold");
  });
});
