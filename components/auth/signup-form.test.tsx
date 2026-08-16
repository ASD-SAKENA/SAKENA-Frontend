import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SignupForm } from "./signup-form";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => ({ get: () => null }),
}));

const mutateAsync = vi.fn();
vi.mock("@/queries/auth", () => ({
  useSignupMutation: () => ({ mutateAsync, isPending: false }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SignupForm", () => {
  it("has no mobile field", () => {
    render(<SignupForm />);
    expect(screen.queryByText("شماره موبایل")).not.toBeInTheDocument();
  });

  it("keeps the submit button disabled until name/email/password/agree are all filled", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);
    const submit = screen.getByRole("button", { name: "ایجاد حساب و ورود" });
    expect(submit).toBeDisabled();

    await user.type(screen.getByPlaceholderText("مثلاً علی رضایی"), "Ali");
    await user.type(
      screen.getByPlaceholderText("example@mail.com"),
      "ali@example.com",
    );
    await user.type(
      screen.getByPlaceholderText("حداقل ۸ کاراکتر"),
      "password123",
    );
    expect(submit).toBeDisabled(); // agree checkbox still unchecked

    await user.click(screen.getByRole("checkbox"));
    expect(submit).not.toBeDisabled();
  });

  it("submits with the entered name as username, no mobile field in the payload", async () => {
    mutateAsync.mockResolvedValue({
      user: {
        name: "Ali",
        role: "resident",
        roleLabel: "",
        unit: "",
        initial: "A",
      },
      token: "jwt",
    });
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByPlaceholderText("مثلاً علی رضایی"), "Ali");
    await user.type(
      screen.getByPlaceholderText("example@mail.com"),
      "ali@example.com",
    );
    await user.type(
      screen.getByPlaceholderText("حداقل ۸ کاراکتر"),
      "password123",
    );
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "ایجاد حساب و ورود" }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
    const payload = mutateAsync.mock.calls[0]?.[0];
    expect(payload).toMatchObject({
      name: "Ali",
      email: "ali@example.com",
      password: "password123",
      role: "resident",
    });
    expect("mobile" in payload).toBe(false);
    expect(toast.success).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/dashboard");
  });

  it("switches the submitted role via RoleChips", async () => {
    mutateAsync.mockResolvedValue({
      user: {
        name: "Ali",
        role: "manager",
        roleLabel: "",
        unit: "",
        initial: "A",
      },
      token: "jwt",
    });
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByPlaceholderText("مثلاً علی رضایی"), "Ali");
    await user.type(
      screen.getByPlaceholderText("example@mail.com"),
      "ali@example.com",
    );
    await user.type(
      screen.getByPlaceholderText("حداقل ۸ کاراکتر"),
      "password123",
    );
    await user.click(screen.getByText("مدیر"));
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "ایجاد حساب و ورود" }));

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({ role: "manager" }),
      ),
    );
  });
});
