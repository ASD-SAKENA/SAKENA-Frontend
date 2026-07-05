import type { Role } from "@/types/app.type";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export interface LoginPayload {
  identifier: string;
  password: string;
  role: Role;
}

export interface SignupPayload {
  name: string;
  mobile: string;
  email?: string;
  buildingCode?: string;
  password: string;
  role: Role;
}

/**
 * Mocked auth. Replace bodies with `http.post("/auth/login/", payload)` etc.
 * For now we just echo the selected role so the client can hydrate the session.
 */
export async function login(payload: LoginPayload): Promise<{ role: Role }> {
  return { role: payload.role };
}

export async function signup(payload: SignupPayload): Promise<{ role: Role }> {
  return { role: payload.role };
}

export async function logout(): Promise<void> {
  return;
}
