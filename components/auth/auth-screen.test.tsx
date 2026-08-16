import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AuthScreen } from "./auth-screen";

vi.mock("./brand-side", () => ({ BrandSide: () => <div>brand-side</div> }));
vi.mock("./login-form", () => ({ LoginForm: () => <div>login-form</div> }));
vi.mock("./signup-form", () => ({ SignupForm: () => <div>signup-form</div> }));

describe("AuthScreen", () => {
  it("shows the login form by default when defaultMode is login", () => {
    render(<AuthScreen defaultMode="login" />);
    expect(screen.getByText("login-form")).toBeInTheDocument();
    expect(screen.queryByText("signup-form")).not.toBeInTheDocument();
  });

  it("shows the signup form by default when defaultMode is signup", () => {
    render(<AuthScreen defaultMode="signup" />);
    expect(screen.getByText("signup-form")).toBeInTheDocument();
  });

  it("switches to signup when the tab is clicked", async () => {
    const user = userEvent.setup();
    render(<AuthScreen defaultMode="login" />);
    await user.click(screen.getByRole("button", { name: "ثبت‌نام" }));
    expect(screen.getByText("signup-form")).toBeInTheDocument();
  });

  it("switches modes via the bottom link too", async () => {
    const user = userEvent.setup();
    render(<AuthScreen defaultMode="login" />);
    await user.click(screen.getByRole("button", { name: "ثبت‌نام کنید" }));
    expect(screen.getByText("signup-form")).toBeInTheDocument();
  });
});
