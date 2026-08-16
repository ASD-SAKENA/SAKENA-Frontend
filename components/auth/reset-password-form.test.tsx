import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ResetPasswordForm } from "./reset-password-form";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const push = vi.fn();
let tokenValue = "valid-token";
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => ({ get: () => tokenValue }),
}));

const mutateAsync = vi.fn();
vi.mock("@/queries/auth", () => ({
  useResetPasswordMutation: () => ({ mutateAsync, isPending: false }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  tokenValue = "valid-token";
});

describe("ResetPasswordForm", () => {
  it("shows an invalid-link message when there is no token", () => {
    tokenValue = "";
    render(<ResetPasswordForm />);
    expect(
      screen.getByText(
        "لینک بازیابی نامعتبر است. از صفحه ورود دوباره درخواست بازیابی دهید.",
      ),
    ).toBeInTheDocument();
  });

  it("rejects mismatched passwords without calling the mutation", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);
    await user.type(
      screen.getByPlaceholderText("حداقل ۸ کاراکتر"),
      "password123",
    );
    await user.type(screen.getByPlaceholderText("••••••••"), "different123");
    await user.click(screen.getByRole("button", { name: "تغییر رمز عبور" }));

    await waitFor(() =>
      expect(
        screen.getByText("تکرار رمز عبور مطابقت ندارد."),
      ).toBeInTheDocument(),
    );
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("submits matching passwords with the token, toasts success, and redirects to login", async () => {
    mutateAsync.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    await user.type(
      screen.getByPlaceholderText("حداقل ۸ کاراکتر"),
      "password123",
    );
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: "تغییر رمز عبور" }));

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        token: "valid-token",
        newPassword: "password123",
      }),
    );
    expect(toast.success).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/login");
  });
});
