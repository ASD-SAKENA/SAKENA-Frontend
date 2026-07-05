"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AppUser, Role } from "@/types/app.type";

/** Mock user profiles per role — replace with the real `me` response later. */
const USERS: Record<Role, AppUser> = {
  resident: {
    name: "مهندس رضایی",
    role: "resident",
    roleLabel: "ساکن — واحد ۱۲",
    unit: "۱۲ — بلوک B",
    initial: "م",
  },
  manager: {
    name: "سرکار خانم احمدی",
    role: "manager",
    roleLabel: "مدیر ساختمان",
    unit: "برج نیلوفر · بلوک B",
    initial: "ا",
  },
  staff: {
    name: "آقای کریمی",
    role: "staff",
    roleLabel: "کارکن خدماتی",
    unit: "واحد خدمات",
    initial: "آ",
  },
};

export function userForRole(role: Role): AppUser {
  return USERS[role];
}

interface AuthState {
  isAuthenticated: boolean;
  user: AppUser | null;
  login: (role: Role) => void;
  logout: () => void;
  /** Preview-only role switch (kept until the real backend fixes the role). */
  setRole: (role: Role) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (role) => set({ isAuthenticated: true, user: USERS[role] }),
      logout: () => set({ isAuthenticated: false, user: null }),
      setRole: (role) => set({ user: USERS[role] }),
    }),
    {
      name: "sakena-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
