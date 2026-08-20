import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ManagerRequest } from "@/types/requests.type";

import { SettleRequestModal } from "./settle-request-modal";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const assignMutateAsync = vi.fn();
const settleMutateAsync = vi.fn();

vi.mock("@/queries/requests", () => ({
  useAssignCostResponsibilityMutation: () => ({
    mutateAsync: assignMutateAsync,
    isPending: false,
  }),
}));
vi.mock("@/queries/wallet", () => ({
  useSettleRequestMutation: () => ({
    mutateAsync: settleMutateAsync,
    isPending: false,
  }),
}));

const baseRequest: ManagerRequest = {
  id: "req-1",
  displayId: "۱۲۳",
  title: "تعمیر آسانسور",
  type: "آسانسور",
  unit: "۱۲ — طبقه ۳",
  requestingUnit: "۱۲ — طبقه ۳",
  date: "۱۴۰۵/۰۵/۰۱",
  status: "تایید شده",
  statusColor: "success",
  apiStatus: "CONFIRMED",
  priority: "نامشخص",
  priorityColor: "muted",
  costResponsibility: null,
  completionCost: 500000,
};

beforeEach(() => {
  vi.clearAllMocks();
  assignMutateAsync.mockResolvedValue(undefined);
  settleMutateAsync.mockResolvedValue(undefined);
});

describe("SettleRequestModal", () => {
  it("renders nothing when no request is selected", () => {
    render(<SettleRequestModal request={null} onClose={() => {}} />);
    expect(screen.queryByText("پرداخت دستمزد")).not.toBeInTheDocument();
  });

  it("offers all three payment methods for a request with a requesting unit", () => {
    render(<SettleRequestModal request={baseRequest} onClose={() => {}} />);

    expect(screen.getByText("تقسیم بین همه واحدها")).toBeInTheDocument();
    expect(screen.getByText("بر عهده واحد درخواست‌دهنده")).toBeInTheDocument();
    expect(screen.getByText("از کیف پول ساختمان")).toBeInTheDocument();
  });

  it("offers only the building wallet when the request has no requesting unit", () => {
    render(
      <SettleRequestModal
        request={{ ...baseRequest, requestingUnit: null }}
        onClose={() => {}}
      />,
    );

    expect(screen.queryByText("تقسیم بین همه واحدها")).not.toBeInTheDocument();
    expect(
      screen.queryByText("بر عهده واحد درخواست‌دهنده"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("از کیف پول ساختمان")).toBeInTheDocument();
  });

  it("keeps submission disabled until a payment method is picked", async () => {
    const user = userEvent.setup();
    render(<SettleRequestModal request={baseRequest} onClose={() => {}} />);

    const submit = screen.getByRole("button", { name: "تایید و پرداخت" });
    expect(submit).toBeDisabled();

    await user.click(screen.getByText("تقسیم بین همه واحدها"));
    expect(submit).toBeEnabled();
  });

  it("assigns the chosen method before settling, then closes", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<SettleRequestModal request={baseRequest} onClose={onClose} />);

    await user.click(screen.getByText("بر عهده واحد درخواست‌دهنده"));
    await user.click(screen.getByRole("button", { name: "تایید و پرداخت" }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(assignMutateAsync).toHaveBeenCalledWith({
      id: "req-1",
      costResponsibility: "REQUESTING_UNIT",
    });
    expect(settleMutateAsync).toHaveBeenCalledWith("req-1");
  });

  it("does not settle when assigning the payment method fails", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    assignMutateAsync.mockRejectedValue(new Error("rejected by server"));
    render(<SettleRequestModal request={baseRequest} onClose={onClose} />);

    await user.click(screen.getByText("از کیف پول ساختمان"));
    await user.click(screen.getByRole("button", { name: "تایید و پرداخت" }));

    await waitFor(() => expect(assignMutateAsync).toHaveBeenCalled());
    expect(settleMutateAsync).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
