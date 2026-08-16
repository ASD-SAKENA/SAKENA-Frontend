import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ForgotPasswordModal } from "./forgot-password-modal";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mutateAsync = vi.fn();
vi.mock("@/queries/auth", () => ({
  useForgotPasswordMutation: () => ({ mutateAsync, isPending: false }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ForgotPasswordModal", () => {
  it("renders nothing when closed", () => {
    render(<ForgotPasswordModal open={false} onClose={vi.fn()} />);
    expect(screen.queryByText("بازیابی رمز عبور")).not.toBeInTheDocument();
  });

  it("rejects an invalid email without calling the mutation", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordModal open onClose={vi.fn()} />);
    await user.type(screen.getByPlaceholderText("example@mail.com"), "bad");
    await user.click(
      screen.getByRole("button", { name: "ارسال لینک بازیابی" }),
    );
    await waitFor(() =>
      expect(screen.getByText("ایمیل معتبر نیست.")).toBeInTheDocument(),
    );
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("submits a valid email, toasts success, and closes", async () => {
    mutateAsync.mockResolvedValue(undefined);
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<ForgotPasswordModal open onClose={onClose} />);

    await user.type(
      screen.getByPlaceholderText("example@mail.com"),
      "resident@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: "ارسال لینک بازیابی" }),
    );

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith("resident@example.com"),
    );
    expect(toast.success).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when cancel is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<ForgotPasswordModal open onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: "انصراف" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
