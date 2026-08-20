import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAppUiStore } from "@/stores/app-ui.store";

import { AppTopbar } from "./app-topbar";

let pathname = "/dashboard";
vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

const setTheme = vi.fn();
let themeValue = "light";
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: themeValue, setTheme }),
}));

vi.mock("@/components/app/notification-bell", () => ({
  NotificationBell: () => <button type="button" title="اعلان‌ها" />,
}));

beforeEach(() => {
  vi.clearAllMocks();
  pathname = "/dashboard";
  themeValue = "light";
  useAppUiStore.setState({ navOpen: false });
});

describe("AppTopbar", () => {
  it("renders the title and breadcrumb for the current route", () => {
    render(<AppTopbar />);
    expect(screen.getByText("داشبورد")).toBeInTheDocument();
  });

  it("opens the mobile nav when the menu button is clicked", async () => {
    const user = userEvent.setup();
    render(<AppTopbar />);

    await user.click(screen.getByTitle("منو"));

    expect(useAppUiStore.getState().navOpen).toBe(true);
  });

  it("toggles the theme when the theme button is clicked", async () => {
    const user = userEvent.setup();
    render(<AppTopbar />);

    await user.click(screen.getByTitle("تغییر تم"));

    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("does not render a style guide link", () => {
    render(<AppTopbar />);
    expect(screen.queryByTitle("راهنمای طراحی")).not.toBeInTheDocument();
  });

  it("renders a notifications button", () => {
    render(<AppTopbar />);
    expect(screen.getByTitle("اعلان‌ها")).toBeInTheDocument();
  });
});
