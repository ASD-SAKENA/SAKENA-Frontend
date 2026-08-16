import { beforeEach, describe, expect, it, vi } from "vitest";

import http from "@/services/http";

import { login, logout, signup } from "./auth";

vi.mock("@/services/http", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedPost = vi.mocked(http.post);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("login", () => {
  it("sends username/password and builds a session from the response", async () => {
    mockedPost.mockResolvedValue({
      data: { token: "jwt", username: "moeein", role: "MANAGER" },
    });

    const session = await login({ username: "moeein", password: "secret" });

    expect(mockedPost).toHaveBeenCalledWith("/auth/login", {
      username: "moeein",
      password: "secret",
    });
    expect(session.token).toBe("jwt");
    expect(session.user.role).toBe("manager");
    expect(session.user.name).toBe("moeein");
  });

  it("defaults an unrecognized role to resident", async () => {
    mockedPost.mockResolvedValue({
      data: { token: "jwt", username: "x", role: "SOMETHING_ELSE" },
    });
    const session = await login({ username: "x", password: "y" });
    expect(session.user.role).toBe("resident");
  });
});

describe("signup", () => {
  it("registers with the entered name as username, without a mobile field", async () => {
    mockedPost.mockResolvedValue({
      data: { token: "jwt", username: "Ali", role: "RESIDENT" },
    });

    const session = await signup({
      name: "Ali",
      email: "ali@example.com",
      password: "password123",
      role: "resident",
    });

    expect(mockedPost).toHaveBeenCalledWith("/auth/register", {
      username: "Ali",
      email: "ali@example.com",
      password: "password123",
      role: "RESIDENT",
    });
    expect(session.user.name).toBe("Ali");
  });

  it("ignores buildingCode (no backend support yet)", async () => {
    mockedPost.mockResolvedValue({
      data: { token: "jwt", username: "Ali", role: "RESIDENT" },
    });

    await signup({
      name: "Ali",
      email: "ali@example.com",
      buildingCode: "SKN-1",
      password: "password123",
      role: "resident",
    });

    const [, body] = mockedPost.mock.calls[0] as [
      string,
      Record<string, unknown>,
    ];
    expect("buildingCode" in body).toBe(false);
  });
});

describe("logout", () => {
  it("resolves without calling the backend (stateless JWT)", async () => {
    await expect(logout()).resolves.toBeUndefined();
    expect(http.post).not.toHaveBeenCalled();
  });
});
