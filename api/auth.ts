import http from "@/services/http";

import { buildAppUser } from "@/stores/auth.store";

import type { AppUser, Role } from "@/types/app.type";
import type { AuthApiResponse } from "@/types/auth.api.type";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export interface LoginPayload {
  username: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface AuthSession {
  user: AppUser;
  token: string;
}

/** Backend roles are uppercase (`RESIDENT`); the app uses lowercase unions. */
function toAppRole(role: string): Role {
  const normalized = role.toLowerCase();
  if (
    normalized === "manager" ||
    normalized === "staff" ||
    normalized === "admin"
  ) {
    return normalized;
  }
  return "resident";
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const { data } = await http.post<AuthApiResponse>("/auth/login", {
    username: payload.username,
    password: payload.password,
  });
  return {
    user: buildAppUser(toAppRole(data.role), data.username),
    token: data.token,
  };
}

export async function signup(payload: SignupPayload): Promise<AuthSession> {
  // The backend identifies users by a unique `username`; we register with
  // the entered name so users log in with it.
  const { data } = await http.post<AuthApiResponse>("/auth/register", {
    username: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role.toUpperCase(),
  });
  return {
    user: buildAppUser(toAppRole(data.role), payload.name),
    token: data.token,
  };
}

export async function forgotPassword(email: string): Promise<void> {
  await http.post("/auth/forgot-password", { email });
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  await http.post("/auth/reset-password", { token, newPassword });
}

/** The backend has no logout endpoint (stateless JWT) — clearing local state
 * in the auth store is the whole logout. */
export async function logout(): Promise<void> {
  return;
}
