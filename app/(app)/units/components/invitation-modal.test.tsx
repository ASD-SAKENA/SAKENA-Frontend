import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { InvitationModal } from "./invitation-modal";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const unitsData = [
  { id: "apt-1", no: "1" },
  { id: "apt-2", no: "2" },
];
let residenciesData: { apartmentId: string }[] = [];

vi.mock("@/queries/units", () => ({
  useBuildingsQuery: () => ({ data: [{ id: "b-1", name: "برج نیلوفر" }] }),
  useUnitsQuery: () => ({ data: unitsData }),
}));
vi.mock("@/queries/residency", () => ({
  useBuildingResidenciesQuery: () => ({ data: residenciesData }),
}));
vi.mock("@/queries/invitations", () => ({
  useCreateInvitationMutation: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  residenciesData = [];
});

function renderModal() {
  render(
    <InvitationModal
      open
      buildingId="b-1"
      onClose={() => {}}
      onCreated={() => {}}
    />,
  );
}

describe("InvitationModal", () => {
  it("offers every unit while the building is empty", () => {
    renderModal();

    expect(screen.getByRole("option", { name: "واحد 1" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "واحد 2" })).toBeInTheDocument();
  });

  it("hides a unit that already has a resident", () => {
    residenciesData = [{ apartmentId: "apt-1" }];
    renderModal();

    expect(
      screen.queryByRole("option", { name: "واحد 1" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "واحد 2" })).toBeInTheDocument();
  });

  it("explains what to do when every unit is taken", () => {
    residenciesData = [{ apartmentId: "apt-1" }, { apartmentId: "apt-2" }];
    renderModal();

    expect(
      screen.getByText(/همه واحدهای این ساختمان ساکن دارند/),
    ).toBeInTheDocument();
  });

  it("no longer offers the phone channel", () => {
    renderModal();

    expect(screen.getByRole("option", { name: "ایمیل" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "لینک عمومی" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "شماره موبایل" }),
    ).not.toBeInTheDocument();
  });
});
