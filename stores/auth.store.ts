"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getQueryClient } from "@/lib/query-client";

import type { AppUser, Role } from "@/types/app.type";

const ROLE_LABELS: Record<Role, string> = {
  resident: "ساکن",
  manager: "مدیر ساختمان",
  staff: "کارکن خدماتی",
  admin: "مدیر سامانه",
};

/**
 * `unit` is client-side only until the backend models units-per-user; the
 * rest of the user comes from the real auth/profile responses.
 */
const ROLE_UNITS: Record<Role, string> = {
  resident: "—",
  manager: "—",
  staff: "واحد خدمات",
  admin: "—",
};

/** Build the app-level user from backend auth data (username + role). */
export function buildAppUser(
  role: Role,
  name: string,
  avatarUrl: string | null = null,
): AppUser {
  return {
    name,
    role,
    roleLabel: ROLE_LABELS[role],
    unit: ROLE_UNITS[role],
    initial: name.trim().charAt(0) || "س",
    avatarUrl,
  };
}

interface AuthState {
  isAuthenticated: boolean;
  user: AppUser | null;
  /** JWT access token; attached as `Authorization: Bearer` by services/http. */
  token: string | null;
  login: (user: AppUser, token: string) => void;
  /** Reflects a picture change everywhere the avatar is shown, at once. */
  setAvatar: (avatarUrl: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      setAvatar: (avatarUrl) =>
        set((state) =>
          state.user ? { user: { ...state.user, avatarUrl } } : {},
        ),
      login: (user, token) => {
        // Drop the previous session's cached queries so a new user never
        // inherits "hasUnit" / building data and fires forbidden requests.
        getQueryClient().clear();
        set({ isAuthenticated: true, user, token });
      },
      logout: () => {
        getQueryClient().clear();
        set({ isAuthenticated: false, user: null, token: null });
      },
    }),
    {
      name: "sakena-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
