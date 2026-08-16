import { beforeEach, describe, expect, it, vi } from "vitest";

import http from "@/services/http";

import { buildAppUser, useAuthStore } from "@/stores/auth.store";

import {
  changePassword,
  getMyUserId,
  getProfile,
  updateProfile,
} from "./profile";

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
  useAuthStore.setState({ isAuthenticated: false, user: null, token: null });
});

describe("getProfile", () => {
  it("prefers the session's name/unit over the raw API response", async () => {
    useAuthStore.setState({
      user: { ...buildAppUser("resident", "Local Name"), unit: "واحد ۱۲" },
    });
    vi.mocked(http.get).mockResolvedValue({
      data: {
        id: "u1",
        username: "backend-username",
        mobile: "0912",
        email: "a@b.com",
        role: "RESIDENT",
        createdAt: "2026-01-01",
        active: true,
      },
    });

    const profile = await getProfile();

    expect(profile.name).toBe("Local Name");
    expect(profile.unit).toBe("واحد ۱۲");
    expect(profile.email).toBe("a@b.com");
    expect("mobile" in profile).toBe(false);
  });

  it("falls back to the API username when there is no local session", async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: {
        id: "u1",
        username: "backend-username",
        mobile: "0912",
        email: "a@b.com",
        role: "RESIDENT",
        createdAt: "2026-01-01",
        active: true,
      },
    });

    const profile = await getProfile();
    expect(profile.name).toBe("backend-username");
    expect(profile.unit).toBe("—");
  });
});

describe("updateProfile", () => {
  it("sends only username/email, not mobile or unit", async () => {
    vi.mocked(http.put).mockResolvedValue({
      data: { username: "New Name", email: "new@example.com" },
    });

    const result = await updateProfile({
      name: "New Name",
      email: "new@example.com",
      unit: "—",
    });

    expect(http.put).toHaveBeenCalledWith("/profile", {
      username: "New Name",
      email: "new@example.com",
    });
    expect(result.name).toBe("New Name");
  });
});

describe("changePassword", () => {
  it("posts current and new passwords", async () => {
    vi.mocked(http.post).mockResolvedValue({ data: {} });
    await changePassword("old", "newpassword1");
    expect(http.post).toHaveBeenCalledWith("/profile/change-password", {
      currentPassword: "old",
      newPassword: "newpassword1",
    });
  });
});

describe("getMyUserId", () => {
  it("returns the id from the profile endpoint", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: { id: "u1" } });
    expect(await getMyUserId()).toBe("u1");
  });
});
