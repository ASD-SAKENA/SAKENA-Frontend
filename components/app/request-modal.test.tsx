import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAppUiStore } from "@/stores/app-ui.store";

import { RequestModal } from "./request-modal";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mutateAsync = vi.fn();
vi.mock("@/queries/requests", () => ({
  useCreateRequestMutation: () => ({ mutateAsync, isPending: false }),
  useRequestCategoriesQuery: () => ({
    data: {
      categories: [
        {
          value: "FACILITIES",
          label: "امکانات",
          subCategories: [{ value: "POOL", label: "استخر" }],
        },
      ],
    },
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  useAppUiStore.setState({ requestModalOpen: false });
});

describe("RequestModal", () => {
  it("is closed by default", () => {
    render(<RequestModal />);
    expect(screen.queryByText("ثبت درخواست خدماتی")).not.toBeInTheDocument();
  });

  it("opens when requestModalOpen is true and shows category options", () => {
    useAppUiStore.setState({ requestModalOpen: true });
    render(<RequestModal />);
    expect(screen.getByText("ثبت درخواست خدماتی")).toBeInTheDocument();
    expect(screen.getByText("امکانات")).toBeInTheDocument();
  });

  it("rejects a submission with too-short a title", async () => {
    useAppUiStore.setState({ requestModalOpen: true });
    const user = userEvent.setup();
    render(<RequestModal />);

    await user.click(screen.getByRole("button", { name: "ثبت درخواست" }));

    await waitFor(() =>
      expect(screen.getByText("زیر‌دسته را انتخاب کنید.")).toBeInTheDocument(),
    );
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("submits a valid request and closes the modal", async () => {
    mutateAsync.mockResolvedValue({ id: "r1" });
    useAppUiStore.setState({ requestModalOpen: true });
    const user = userEvent.setup();
    render(<RequestModal />);

    await user.selectOptions(screen.getByRole("combobox"), "POOL");
    await user.type(
      screen.getByPlaceholderText("مثلاً نشتی شیر آب آشپزخانه"),
      "نشتی آب استخر",
    );
    await user.type(
      screen.getByPlaceholderText("توضیح مختصری درباره مشکل بنویسید…"),
      "آب از لبه استخر نشت می‌کند",
    );
    await user.click(screen.getByRole("button", { name: "ثبت درخواست" }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalled();
    expect(useAppUiStore.getState().requestModalOpen).toBe(false);
  });
});
