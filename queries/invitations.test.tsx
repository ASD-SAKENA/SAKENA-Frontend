import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { invitationKeys } from "@/api/invitations";
import {
  acceptInvitation,
  getInvitations,
  previewInvitation,
} from "@/api/invitations";
import { residencyKeys } from "@/api/residency";

import {
  useAcceptInvitationMutation,
  useBuildingInvitationsQuery,
  useInvitationPreviewQuery,
} from "./invitations";
import { createTestQueryClient, createWrapper } from "./test-utils";

vi.mock("@/api/invitations", () => ({
  invitationKeys: {
    all: ["invitations"],
    byBuilding: (id: string) => ["invitations", "building", id],
    preview: (token: string) => ["invitations", "preview", token],
  },
  previewInvitation: vi.fn(),
  getInvitations: vi.fn(),
  createInvitation: vi.fn(),
  revokeInvitation: vi.fn(),
  acceptInvitation: vi.fn(),
}));
vi.mock("@/api/residency", () => ({
  residencyKeys: { all: ["residencies"] },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useInvitationPreviewQuery", () => {
  it("is disabled without a token", () => {
    const { result } = renderHook(() => useInvitationPreviewQuery(null), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(previewInvitation).not.toHaveBeenCalled();
  });

  it("fetches once a token is given and never retries", async () => {
    vi.mocked(previewInvitation).mockResolvedValue({
      buildingName: "برج",
    } as never);
    const { result } = renderHook(() => useInvitationPreviewQuery("tok-1"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(previewInvitation).toHaveBeenCalledWith("tok-1");
  });
});

describe("useBuildingInvitationsQuery", () => {
  it("is disabled without a buildingId", () => {
    const { result } = renderHook(() => useBuildingInvitationsQuery(null), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(getInvitations).not.toHaveBeenCalled();
  });
});

describe("useAcceptInvitationMutation", () => {
  it("invalidates both invitations and residencies (accepting may assign a unit)", async () => {
    vi.mocked(acceptInvitation).mockResolvedValue({} as never);
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useAcceptInvitationMutation(), {
      wrapper: createWrapper(client),
    });
    result.current.mutate("tok-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: invitationKeys.all,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: residencyKeys.all });
  });
});
