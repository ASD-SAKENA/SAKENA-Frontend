import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MemberList } from "./member-list";

let membersData: unknown[] = [];
vi.mock("@/queries/invitations", () => ({
  useBuildingMembersQuery: () => ({ data: membersData }),
}));
vi.mock("./assign-unit-modal", () => ({
  AssignUnitModal: () => null,
}));

const housed = {
  userId: "u-1",
  username: "علی رضایی",
  email: "ali@mail.com",
  role: "RESIDENT",
  unitNumber: "3",
  tenancy: "OWNER_OCCUPIER",
};
const unhoused = {
  userId: "u-2",
  username: "سارا محمدی",
  email: "sara@mail.com",
  role: "RESIDENT",
  unitNumber: null,
  tenancy: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  membersData = [];
});

describe("MemberList", () => {
  it("renders nothing when no building is selected", () => {
    membersData = [housed];
    const { container } = render(<MemberList buildingId={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when the building has no members yet", () => {
    const { container } = render(<MemberList buildingId="b-1" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows each member with their email", () => {
    membersData = [housed, unhoused];
    render(<MemberList buildingId="b-1" />);

    expect(screen.getByText("علی رضایی")).toBeInTheDocument();
    expect(screen.getByText("ali@mail.com")).toBeInTheDocument();
    expect(screen.getByText("سارا محمدی")).toBeInTheDocument();
  });

  it("offers the assign action only to a member with no unit", () => {
    membersData = [housed, unhoused];
    render(<MemberList buildingId="b-1" />);

    // One row is already housed, so only the other can be assigned.
    expect(screen.getAllByRole("button", { name: /اختصاص واحد/ })).toHaveLength(
      1,
    );
    expect(screen.getByText("بدون واحد")).toBeInTheDocument();
  });

  it("counts how many members are still waiting for a unit", () => {
    membersData = [housed, unhoused];
    render(<MemberList buildingId="b-1" />);

    expect(screen.getByText(/1 نفر بدون واحد/)).toBeInTheDocument();
  });
});
