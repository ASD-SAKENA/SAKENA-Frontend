import { beforeEach, describe, expect, it, vi } from "vitest";

import http from "@/services/http";

import {
  acceptInvitation,
  createInvitation,
  getInvitations,
  previewInvitation,
  revokeInvitation,
} from "./invitations";

vi.mock("@/services/http", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("previewInvitation", () => {
  it("suppresses the global error toast (join screen reads it pre-auth)", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: { buildingName: "برج" } });
    await previewInvitation("token-1");
    expect(http.get).toHaveBeenCalledWith("/invitations/preview", {
      params: { token: "token-1" },
      suppressToast: true,
    });
  });
});

describe("acceptInvitation", () => {
  it("posts with the token as a query param, no body", async () => {
    vi.mocked(http.post).mockResolvedValue({ data: { id: "inv-1" } });
    await acceptInvitation("token-1");
    expect(http.post).toHaveBeenCalledWith("/invitations/accept", undefined, {
      params: { token: "token-1" },
    });
  });
});

describe("getInvitations", () => {
  it("filters by buildingId", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [] });
    await getInvitations("b1");
    expect(http.get).toHaveBeenCalledWith("/invitations", {
      params: { buildingId: "b1" },
    });
  });
});

describe("createInvitation", () => {
  it("posts to the building's invitation route", async () => {
    vi.mocked(http.post).mockResolvedValue({ data: { id: "inv-1" } });
    const payload = {
      channel: "EMAIL" as const,
      recipient: "a@b.com",
      role: "RESIDENT" as const,
      tenancy: "TENANT" as const,
    };
    await createInvitation("b1", payload);
    expect(http.post).toHaveBeenCalledWith(
      "/invitations/buildings/b1",
      payload,
    );
  });
});

describe("revokeInvitation", () => {
  it("deletes the invitation by id", async () => {
    vi.mocked(http.delete).mockResolvedValue({ data: { id: "inv-1" } });
    await revokeInvitation("inv-1");
    expect(http.delete).toHaveBeenCalledWith("/invitations/inv-1");
  });
});
