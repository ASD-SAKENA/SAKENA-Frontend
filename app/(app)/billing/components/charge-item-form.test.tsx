import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ChargeItemForm } from "./charge-item-form";

const mutateAsync = vi.fn();

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/queries/billing", () => ({
  useAddChargeItemMutation: () => ({
    mutateAsync,
    isPending: false,
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mutateAsync.mockResolvedValue({ id: "item-1" });
});

describe("ChargeItemForm", () => {
  it("can add a second cost line after the first succeeds", async () => {
    const user = userEvent.setup();
    render(<ChargeItemForm periodId="period-1" />);

    await user.type(
      screen.getByPlaceholderText("مثلاً شارژ ثابت ماهانه"),
      "نگهبانی",
    );
    await user.type(screen.getByPlaceholderText("850000"), "500000");
    await user.click(screen.getByRole("button", { name: "افزودن" }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(mutateAsync).toHaveBeenLastCalledWith({
      periodId: "period-1",
      payload: {
        title: "نگهبانی",
        amount: 500000,
        kind: "RECURRING_CHARGE",
        allocation: "EQUAL",
      },
    });

    await waitFor(() =>
      expect(screen.getByPlaceholderText("مثلاً شارژ ثابت ماهانه")).toHaveValue(
        "",
      ),
    );

    await user.type(
      screen.getByPlaceholderText("مثلاً شارژ ثابت ماهانه"),
      "آسانسور",
    );
    await user.type(screen.getByPlaceholderText("850000"), "250000");
    await user.click(screen.getByRole("button", { name: "افزودن" }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(2));
    expect(mutateAsync).toHaveBeenLastCalledWith({
      periodId: "period-1",
      payload: {
        title: "آسانسور",
        amount: 250000,
        kind: "RECURRING_CHARGE",
        allocation: "EQUAL",
      },
    });
    expect(
      screen.queryByText("عنوان هزینه را وارد کنید."),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("مبلغ باید عدد (تومان) باشد."),
    ).not.toBeInTheDocument();
  });
});
