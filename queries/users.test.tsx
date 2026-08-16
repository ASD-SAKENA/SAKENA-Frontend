import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { userKeys } from "@/api/users";
import { getUsers, updateUserSpecialty, updateUserStatus } from "@/api/users";

import { createTestQueryClient, createWrapper } from "./test-utils";
import {
  useUpdateUserSpecialtyMutation,
  useUpdateUserStatusMutation,
  useUsersQuery,
} from "./users";

vi.mock("@/api/users", () => ({
  userKeys: {
    all: ["users"],
    list: (role?: string) => ["users", "list", role ?? ""],
  },
  getUsers: vi.fn(),
  updateUserStatus: vi.fn(),
  updateUserSpecialty: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useUsersQuery", () => {
  it("fetches, optionally filtered by role", async () => {
    vi.mocked(getUsers).mockResolvedValue([]);
    const { result } = renderHook(() => useUsersQuery("STAFF"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getUsers).toHaveBeenCalledWith("STAFF");
  });
});

describe("user mutations invalidate the users.all key", () => {
  it("useUpdateUserStatusMutation", async () => {
    vi.mocked(updateUserStatus).mockResolvedValue({} as never);
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useUpdateUserStatusMutation(), {
      wrapper: createWrapper(client),
    });
    result.current.mutate({ id: "u1", active: false });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updateUserStatus).toHaveBeenCalledWith("u1", false);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: userKeys.all });
  });

  it("useUpdateUserSpecialtyMutation", async () => {
    vi.mocked(updateUserSpecialty).mockResolvedValue({} as never);
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useUpdateUserSpecialtyMutation(), {
      wrapper: createWrapper(client),
    });
    result.current.mutate({ id: "u1", specialty: "برق‌کاری" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updateUserSpecialty).toHaveBeenCalledWith("u1", "برق‌کاری");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: userKeys.all });
  });
});
