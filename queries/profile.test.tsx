import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { profileKeys } from "@/api/profile";
import {
  changePassword,
  getMyUserId,
  getProfile,
  updateProfile,
} from "@/api/profile";

import {
  useChangePasswordMutation,
  useMyUserIdQuery,
  useProfileQuery,
  useUpdateProfileMutation,
} from "./profile";
import { createTestQueryClient, createWrapper } from "./test-utils";

vi.mock("@/api/profile", () => ({
  profileKeys: { all: ["profile"], id: ["profile", "id"] },
  getProfile: vi.fn(),
  updateProfile: vi.fn(),
  changePassword: vi.fn(),
  getMyUserId: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useProfileQuery / useMyUserIdQuery", () => {
  it("fetch through their api functions", async () => {
    vi.mocked(getProfile).mockResolvedValue({
      name: "x",
      email: "x@x.com",
      unit: "—",
    });
    vi.mocked(getMyUserId).mockResolvedValue("u1");

    const { result: profile } = renderHook(() => useProfileQuery(), {
      wrapper: createWrapper(),
    });
    const { result: id } = renderHook(() => useMyUserIdQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(profile.current.isSuccess).toBe(true));
    await waitFor(() => expect(id.current.isSuccess).toBe(true));
    expect(id.current.data).toBe("u1");
  });
});

describe("useUpdateProfileMutation", () => {
  it("invalidates the profile query on success", async () => {
    vi.mocked(updateProfile).mockResolvedValue({
      name: "New",
      email: "n@n.com",
      unit: "—",
    });
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useUpdateProfileMutation(), {
      wrapper: createWrapper(client),
    });
    result.current.mutate({ name: "New", email: "n@n.com", unit: "—" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: profileKeys.all });
  });
});

describe("useChangePasswordMutation", () => {
  it("calls changePassword with current/new passwords", async () => {
    vi.mocked(changePassword).mockResolvedValue(undefined);
    const { result } = renderHook(() => useChangePasswordMutation(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({
      currentPassword: "old",
      newPassword: "newpassword1",
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(changePassword).toHaveBeenCalledWith("old", "newpassword1");
  });
});
