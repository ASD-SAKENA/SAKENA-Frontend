import http from "@/services/http";

import { useAuthStore } from "@/stores/auth.store";

import type { ProfileForm } from "@/schemas/profile.schema";

import type { ProfileApiResponse } from "@/types/auth.api.type";

export const profileKeys = {
  all: ["profile"] as const,
};

/**
 * The backend profile stores `username` (the registered mobile number) and
 * `email`. `name` and `unit` are not modelled server-side yet, so they come
 * from the local session and stay client-only until the backend adds them.
 */
function toProfileForm(data: ProfileApiResponse): ProfileForm {
  const stored = useAuthStore.getState().user;
  return {
    name: stored?.name ?? data.username,
    mobile: data.username,
    email: data.email,
    unit: stored?.unit ?? "—",
  };
}

export async function getProfile(): Promise<ProfileForm> {
  const { data } = await http.get<ProfileApiResponse>("/profile");
  return toProfileForm(data);
}

export async function updateProfile(
  payload: ProfileForm,
): Promise<ProfileForm> {
  const { data } = await http.put<ProfileApiResponse>("/profile", {
    username: payload.mobile,
    email: payload.email,
  });
  return {
    ...payload,
    mobile: data.username,
    email: data.email,
  };
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await http.post("/profile/change-password", {
    currentPassword,
    newPassword,
  });
}
