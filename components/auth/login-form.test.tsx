import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "./login-form";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const push = vi.fn();
let nextValue: string | null = null;
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => ({ get: () => nextValue }),
}));

const mutateAsync = vi.fn();
vi.mock("@/queries/auth", () => ({
  useLoginMutation: () => ({ mutateAsync, isPending: false }),
  // LoginForm also renders ForgotPasswordModal, which needs this.
  useForgotPasswordMutation: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  nextValue = null;
});

describe("LoginForm", () => {
  it("asks for a username, not an email or mobile number", () => {
    render(<LoginForm />);
    expect(screen.getByText("نام کاربری")).toBeInTheDocument();
    expect(screen.queryByText("ایمیل یا شماره موبایل")).not.toBeInTheDocument();
  });

  it("has no role picker", () => {
    render(<LoginForm />);
    expect(screen.queryByText("ورود به‌عنوان")).not.toBeInTheDocument();
  });

  it("rejects an empty username without calling the mutation", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.type(screen.getByPlaceholderText("••••••••"), "secret");
    await user.click(screen.getByRole("button", { name: "ورود به سامانه" }));

    await waitFor(() =>
      expect(screen.getByText("نام کاربری را وارد کنید.")).toBeInTheDocument(),
    );
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("logs in, stores the session, and redirects to the role's home", async () => {
    mutateAsync.mockResolvedValue({
      user: {
        name: "moeein",
        role: "manager",
        roleLabel: "",
        unit: "",
        initial: "m",
      },
      token: "jwt",
    });
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("username"), "moeein");
    await user.type(screen.getByPlaceholderText("••••••••"), "secret");
    await user.click(screen.getByRole("button", { name: "ورود به سامانه" }));

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        username: "moeein",
        password: "secret",
      }),
    );
    expect(toast.success).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/dashboard");
  });

  it("redirects to `next` instead of the role home when present", async () => {
    nextValue = "/join?token=abc";
    mutateAsync.mockResolvedValue({
      user: {
        name: "moeein",
        role: "resident",
        roleLabel: "",
        unit: "",
        initial: "m",
      },
      token: "jwt",
    });
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("username"), "moeein");
    await user.type(screen.getByPlaceholderText("••••••••"), "secret");
    await user.click(screen.getByRole("button", { name: "ورود به سامانه" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/join?token=abc"));
  });

  it("opens the forgot-password modal", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.click(screen.getByRole("button", { name: "فراموشی رمز؟" }));
    expect(screen.getByText("بازیابی رمز عبور")).toBeInTheDocument();
  });
});
