import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createWrapper } from "@/queries/test-utils";

import { useAppUiStore } from "@/stores/app-ui.store";
import { buildAppUser, useAuthStore } from "@/stores/auth.store";

import { AppSidebar } from "./app-sidebar";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ push }),
}));

let residentRequests: { apiStatus: string }[] = [];
let managerRequests: { apiStatus: string }[] = [];
let myResidency: {
  unitNumber: string | null;
  buildingName: string | null;
} | null = null;
let buildings: { id: string; name: string }[] = [];

vi.mock("@/queries/requests", () => ({
  useResidentRequestsQuery: () => ({ data: residentRequests }),
  useManagerRequestsQuery: () => ({ data: managerRequests }),
}));

vi.mock("@/queries/residency", () => ({
  useMyResidencyQuery: () => ({ data: myResidency, isFetched: true }),
}));

vi.mock("@/queries/units", () => ({
  useBuildingsQuery: () => ({ data: buildings, isFetched: true }),
}));

vi.mock("@/queries/tasks", () => ({
  useStaffTasksQuery: () => ({ data: [] }),
}));

vi.mock("@/queries/wallet", () => ({
  usePendingPaymentsQuery: () => ({ data: [] }),
}));

vi.mock("@/hooks/use-building-access", () => ({
  useBuildingAccess: () => ({ ready: true, hasBuilding: true }),
}));

function renderSidebar() {
  return render(<AppSidebar />, { wrapper: createWrapper() });
}

beforeEach(() => {
  vi.clearAllMocks();
  residentRequests = [];
  managerRequests = [];
  myResidency = null;
  buildings = [{ id: "b1", name: "برج نیلوفر" }];
  useAuthStore.setState({
    isAuthenticated: true,
    user: buildAppUser("manager", "مریم احمدی"),
    token: "t",
  });
  useAppUiStore.setState({ navOpen: false });
});

describe("AppSidebar", () => {
  it("renders the manager's nav items, including the profile entry", () => {
    renderSidebar();
    expect(screen.getByText("داشبورد")).toBeInTheDocument();
    expect(screen.getByText("پروفایل")).toBeInTheDocument();
  });

  it("shows the signed-in user's name and role", () => {
    renderSidebar();
    expect(screen.getByText("مریم احمدی")).toBeInTheDocument();
    expect(screen.getByText("مدیر ساختمان")).toBeInTheDocument();
  });

  it("logs out and redirects to /login on the logout button", async () => {
    const user = userEvent.setup();
    renderSidebar();
    await user.click(screen.getByTitle("خروج"));
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(push).toHaveBeenCalledWith("/login");
  });

  it("highlights the active nav item for the current pathname", () => {
    renderSidebar();
    const dashboardLink = screen.getByText("داشبورد").closest("a");
    expect(dashboardLink?.className).toContain("text-app-gold");
  });

  it("shows a badge with the pending count on the queue item", () => {
    managerRequests = [{ apiStatus: "PENDING" }, { apiStatus: "PENDING" }];
    renderSidebar();
    const queueLink = screen.getByText("صف درخواست‌ها").closest("a");
    expect(queueLink?.textContent).toContain("۲");
  });

  it("shows the managed building name under the brand", () => {
    renderSidebar();
    expect(screen.getByText("برج نیلوفر")).toBeInTheDocument();
    expect(screen.queryByText("—")).not.toBeInTheDocument();
  });

  it("shows the resident unit under the brand", () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: buildAppUser("resident", "علی رضایی"),
      token: "t",
    });
    myResidency = { unitNumber: "12", buildingName: "برج نیلوفر" };
    renderSidebar();
    expect(screen.getByText("واحد ۱۲ — برج نیلوفر")).toBeInTheDocument();
  });

  it("badges resident requests with only unfinished ones", () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: buildAppUser("resident", "علی رضایی"),
      token: "t",
    });
    residentRequests = [
      { apiStatus: "PENDING" },
      { apiStatus: "IN_PROGRESS" },
      { apiStatus: "COMPLETED" },
      { apiStatus: "CONFIRMED" },
      { apiStatus: "SETTLED" },
      { apiStatus: "REJECTED" },
    ];
    renderSidebar();
    const requestsLink = screen.getByText("درخواست‌های خدماتی").closest("a");
    expect(requestsLink?.textContent).toContain("۳");
    expect(requestsLink?.textContent).not.toContain("۶");
  });
});
