import { beforeEach, describe, expect, it } from "vitest";

import { buildAppUser, useAuthStore } from "./auth.store";

describe("buildAppUser", () => {
  it("builds a resident with the resident role label", () => {
    const user = buildAppUser("resident", "Ali Rezaei");
    expect(user).toEqual({
      name: "Ali Rezaei",
      role: "resident",
      roleLabel: "ساکن",
      unit: "—",
      initial: "A",
      avatarUrl: null,
    });
  });

  it("builds a staff user with the staff unit label", () => {
    const user = buildAppUser("staff", "Sara");
    expect(user.roleLabel).toBe("کارکن خدماتی");
    expect(user.unit).toBe("واحد خدمات");
  });

  it("falls back to a placeholder initial for an empty name", () => {
    expect(buildAppUser("resident", "   ").initial).toBe("س");
  });
});

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  });

  it("starts unauthenticated", () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it("login sets the user, token and authenticated flag", () => {
    const user = buildAppUser("manager", "Maryam");
    useAuthStore.getState().login(user, "jwt-token");

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(user);
    expect(state.token).toBe("jwt-token");
  });

  it("logout clears the session", () => {
    useAuthStore.getState().login(buildAppUser("resident", "Ali"), "token");
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it("does not expose a role-switch action", () => {
    expect("setRole" in useAuthStore.getState()).toBe(false);
  });
});
