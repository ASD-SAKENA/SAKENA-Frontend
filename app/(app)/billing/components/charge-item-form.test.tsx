import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Unit } from "@/types/units.type";

import { ChargeItemForm } from "./charge-item-form";

const mutateAsync = vi.fn();

const unit = (id: string, no: string): Unit => ({
  id,
  buildingId: "b-1",
  no,
  resident: "—",
  tenancy: "—",
  balance: "۰",
  balanceColor: "muted",
  status: "خالی",
  statusColor: "muted",
  raw: { unitNumber: no, floorNumber: 1, areaSquareMeters: 80, bedrooms: 2 },
});

const UNITS: Unit[] = [unit("apt-1", "1"), unit("apt-2", "2")];

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
    render(<ChargeItemForm periodId="period-1" units={UNITS} />);

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
  it("bills one unit when the cost falls on it", async () => {
    // The unit picker only exists for SPECIFIC_UNIT, and the id has to reach
    // the API — without it the aggregate refuses the item outright.
    const user = userEvent.setup();
    render(<ChargeItemForm periodId="period-1" units={UNITS} />);

    await user.type(
      screen.getByPlaceholderText("مثلاً شارژ ثابت ماهانه"),
      "تعمیر درب واحد ۲",
    );
    await user.type(screen.getByPlaceholderText("850000"), "300000");
    await user.selectOptions(
      screen.getByLabelText("نحوه تقسیم"),
      "SPECIFIC_UNIT",
    );
    await user.selectOptions(screen.getByLabelText("واحد"), "apt-2");
    await user.click(screen.getByRole("button", { name: "افزودن" }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(mutateAsync).toHaveBeenLastCalledWith({
      periodId: "period-1",
      payload: {
        title: "تعمیر درب واحد 2",
        amount: 300000,
        kind: "RECURRING_CHARGE",
        allocation: "SPECIFIC_UNIT",
        targetApartmentId: "apt-2",
      },
    });
  });

  it("asks for the unit instead of sending an item the API would refuse", async () => {
    const user = userEvent.setup();
    render(<ChargeItemForm periodId="period-1" units={UNITS} />);

    await user.type(
      screen.getByPlaceholderText("مثلاً شارژ ثابت ماهانه"),
      "تعمیر",
    );
    await user.type(screen.getByPlaceholderText("850000"), "300000");
    await user.selectOptions(
      screen.getByLabelText("نحوه تقسیم"),
      "SPECIFIC_UNIT",
    );
    await user.click(screen.getByRole("button", { name: "افزودن" }));

    expect(
      await screen.findByText("واحد موردنظر را انتخاب کنید."),
    ).toBeInTheDocument();
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("hides the unit picker for a cost split across the building", async () => {
    const user = userEvent.setup();
    render(<ChargeItemForm periodId="period-1" units={UNITS} />);

    expect(screen.queryByLabelText("واحد")).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByLabelText("نحوه تقسیم"),
      "SPECIFIC_UNIT",
    );
    expect(screen.getByLabelText("واحد")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("نحوه تقسیم"), "BY_AREA");
    expect(screen.queryByLabelText("واحد")).not.toBeInTheDocument();
  });
});
