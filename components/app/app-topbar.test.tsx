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

  it("links to the style guide", () => {
    render(<AppTopbar />);
    expect(screen.getByTitle("راهنمای طراحی")).toHaveAttribute(
      "href",
      "/style-guide",
    );
  });

  it("renders a notifications button", () => {
    render(<AppTopbar />);
    expect(screen.getByTitle("اعلان‌ها")).toBeInTheDocument();
  });
});
