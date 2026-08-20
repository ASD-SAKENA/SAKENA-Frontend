import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildAppUser, useAuthStore } from "@/stores/auth.store";

import ReservePage from "./page";

const { myBookingsPanel } = vi.hoisted(() => ({
  myBookingsPanel: vi.fn(),
}));

vi.mock("@/queries/dashboard", () => ({
  useResidentDashboardQuery: () => ({ data: undefined }),
}));
vi.mock("@/hooks/use-selected-facility", () => ({
  useSelectedFacility: () => ({ selected: null }),
}));
vi.mock("./components/facility-tabs", () => ({
  FacilityTabs: () => <div>امکانات</div>,
}));
vi.mock("./components/reserve-calendar", () => ({
  ReserveCalendar: () => <div>تقویم رزرو</div>,
}));
vi.mock("./components/reserve-composer", () => ({
  ReserveComposer: () => <div>فرم رزرو</div>,
}));
vi.mock("./components/facility-manage-modal", () => ({
  FacilityManageModal: ({ open }: { open: boolean }) =>
    open ? <div>مدیریت امکانات باز است</div> : null,
}));
vi.mock("./components/my-bookings-panel", () => ({
  MyBookingsPanel: myBookingsPanel,
}));

beforeEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState({
    isAuthenticated: true,
    user: buildAppUser("manager", "مریم احمدی"),
    token: "token",
  });
});

describe("ReservePage", () => {
  it("does not mount the resident-only bookings panel for a manager", () => {
    render(<ReservePage />);

    expect(myBookingsPanel).not.toHaveBeenCalled();
    expect(screen.getByText("امکانات")).toBeInTheDocument();
    expect(screen.getByText("تقویم رزرو")).toBeInTheDocument();
  });

  it("keeps the facility management modal available to a manager", async () => {
    const user = userEvent.setup();
    render(<ReservePage />);

    await user.click(screen.getByRole("button", { name: "مدیریت امکانات" }));

    expect(screen.getByText("مدیریت امکانات باز است")).toBeInTheDocument();
  });
});
