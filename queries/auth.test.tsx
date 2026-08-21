import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { forgotPassword, login, resetPassword, signup } from "@/api/auth";

import {
  useForgotPasswordMutation,
  useLoginMutation,
  useResetPasswordMutation,
  useSignupMutation,
} from "./auth";
import { createWrapper } from "./test-utils";

vi.mock("@/api/auth", () => ({
  login: vi.fn(),
  signup: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useLoginMutation", () => {
  it("calls login with the given credentials", async () => {
    vi.mocked(login).mockResolvedValue({
      user: {
        name: "x",
        role: "resident",
        roleLabel: "",
        unit: "",
        avatarUrl: null,
        initial: "x",
      },
      token: "t",
    });
    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({ username: "moeein", password: "secret" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(vi.mocked(login).mock.calls[0]?.[0]).toEqual({
      username: "moeein",
      password: "secret",
    });
  });
});

describe("useSignupMutation", () => {
  it("calls signup with the given payload", async () => {
    vi.mocked(signup).mockResolvedValue({
      user: {
        name: "x",
        role: "resident",
        roleLabel: "",
        unit: "",
        avatarUrl: null,
        initial: "x",
      },
      token: "t",
    });
    const { result } = renderHook(() => useSignupMutation(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({
      name: "Ali",
      email: "a@b.com",
      password: "password123",
      role: "resident",
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(signup).toHaveBeenCalled();
  });
});

describe("useForgotPasswordMutation", () => {
  it("calls forgotPassword with the email", async () => {
    vi.mocked(forgotPassword).mockResolvedValue(undefined);
    const { result } = renderHook(() => useForgotPasswordMutation(), {
      wrapper: createWrapper(),
    });
    result.current.mutate("a@b.com");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(vi.mocked(forgotPassword).mock.calls[0]?.[0]).toBe("a@b.com");
  });
});

describe("useResetPasswordMutation", () => {
  it("calls resetPassword with the token and new password", async () => {
    vi.mocked(resetPassword).mockResolvedValue(undefined);
    const { result } = renderHook(() => useResetPasswordMutation(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({ token: "tok", newPassword: "newpassword1" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(resetPassword).toHaveBeenCalledWith("tok", "newpassword1");
  });
});
