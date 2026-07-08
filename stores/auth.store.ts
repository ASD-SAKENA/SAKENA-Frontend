"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AppUser, Role } from "@/types/app.type";

const ROLE_LABELS: Record<Role, string> = {
  resident: "ساکن",
  manager: "مدیر ساختمان",
  staff: "کارکن خدماتی",
};

/**
 * `unit` is client-side only until the backend models units-per-user; the
 * rest of the user comes from the real auth/profile responses.
 */
const ROLE_UNITS: Record<Role, string> = {
  resident: "—",
  manager: "—",
  staff: "واحد خدمات",
};

/** Build the app-level user from backend auth data (username + role). */
export function buildAppUser(role: Role, name: string): AppUser {
  return {
    name,
    role,
    roleLabel: ROLE_LABELS[role],
    unit: ROLE_UNITS[role],
    initial: name.trim().charAt(0) || "س",
  };
}

interface AuthState {
  isAuthenticated: boolean;
  user: AppUser | null;
  /** JWT access token; attached as `Authorization: Bearer` by services/http. */
  token: string | null;
  login: (user: AppUser, token: string) => void;
  logout: () => void;
  /** Preview-only role switch (keeps the real name/token, swaps the role). */
  setRole: (role: Role) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (user, token) => set({ isAuthenticated: true, user, token }),
      logout: () => set({ isAuthenticated: false, user: null, token: null }),
      setRole: (role) =>
        set((state) => ({
          user: buildAppUser(role, state.user?.name ?? ROLE_LABELS[role]),
        })),
    }),
    {
      name: "sakena-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
