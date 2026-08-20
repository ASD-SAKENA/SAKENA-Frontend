import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import UnitsPage from "./page";

const { unitsQuery, residenciesQuery } = vi.hoisted(() => ({
  unitsQuery: vi.fn(),
  residenciesQuery: vi.fn(),
}));

const buildings = [
  {
    id: "building-1",
    name: "ساختمان اول",
    address: "تهران",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "building-2",
    name: "ساختمان دوم",
    address: "تهران",
    createdAt: "",
    updatedAt: "",
  },
];

vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

vi.mock("@/components/app/app-button", () => ({
  AppButton: ({ children, ...props }: React.ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));
vi.mock("@/components/app/app-icon", () => ({
  AppIcon: () => null,
}));
vi.mock("@/components/app/modal", () => ({
  Modal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/components/app/status-badge", () => ({
  StatusBadge: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/queries/units", () => ({
  useBuildingsQuery: () => ({ data: buildings }),
  useUnitsQuery: unitsQuery,
  useDeleteApartmentMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));
vi.mock("@/queries/residency", () => ({
  useBuildingResidenciesQuery: residenciesQuery,
  useEndResidencyMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));
vi.mock("./components/apartment-modal", () => ({
  ApartmentModal: () => null,
}));
vi.mock("./components/building-modal", () => ({
  BuildingModal: () => null,
}));
vi.mock("./components/invitation-list", () => ({
  InvitationList: () => null,
}));

beforeEach(() => {
  vi.clearAllMocks();
  unitsQuery.mockReturnValue({
    data: [
      {
        id: "apartment-2",
        buildingId: "building-2",
        no: "۲",
        resident: "—",
        tenancy: "طبقه ۱",
        balance: "۰",
        balanceColor: "muted",
        status: "فعال",
        statusColor: "info",
        raw: {
          unitNumber: "2",
          floorNumber: 1,
          areaSquareMeters: 80,
          bedrooms: 2,
        },
      },
    ],
  });
  residenciesQuery.mockReturnValue({
    data: [
      {
        id: "residency-1",
        apartmentId: "apartment-2",
        residentId: "resident-1",
        residentName: "سارا",
        unitNumber: "2",
        buildingId: "building-2",
        buildingName: "ساختمان دوم",
        floorNumber: 1,
        areaSquareMeters: 80,
        bedrooms: 2,
        tenancy: "TENANT",
        movedInAt: "",
        movedOutAt: null,
        active: true,
      },
    ],
  });
});

describe("UnitsPage", () => {
  it("uses the all-buildings scope for apartments and residencies when multiple buildings are returned", () => {
    render(<UnitsPage />);

    expect(unitsQuery).toHaveBeenLastCalledWith(null);
    expect(residenciesQuery).toHaveBeenLastCalledWith(null, [
      "building-1",
      "building-2",
    ]);
  });

  it("shows the resident assigned to a unit by apartment ID", () => {
    render(<UnitsPage />);

    expect(screen.getByText("سارا")).toBeInTheDocument();
  });

  it("uses the selected building scope for apartments and residencies", async () => {
    const user = userEvent.setup();
    render(<UnitsPage />);

    await user.selectOptions(
      screen.getByLabelText("انتخاب ساختمان"),
      "building-2",
    );

    expect(unitsQuery).toHaveBeenLastCalledWith("building-2");
    expect(residenciesQuery).toHaveBeenLastCalledWith("building-2", []);
  });
});
