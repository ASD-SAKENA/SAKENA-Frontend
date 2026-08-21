import http from "@/services/http";

import { useAuthStore } from "@/stores/auth.store";

import type { ProfileForm } from "@/schemas/profile.schema";

import type { ProfileApiResponse } from "@/types/auth.api.type";

export const profileKeys = {
  all: ["profile"] as const,
  id: ["profile", "id"] as const,
};

/**
 * `name` and `unit` are not modelled server-side yet, so they come from the
 * local session and stay client-only until the backend adds them.
 */
function toProfileForm(data: ProfileApiResponse): ProfileForm {
  const stored = useAuthStore.getState().user;
  return {
    name: stored?.name ?? data.username,
    email: data.email,
    unit: stored?.unit ?? "—",
  };
}

export async function getProfile(): Promise<ProfileForm> {
  const { data } = await http.get<ProfileApiResponse>("/profile");
  // The sidebar and chat read the picture from the session, so a fresh
  // profile load keeps them in step with the server.
  useAuthStore.getState().setAvatar(data.avatarUrl ?? null);
  return toProfileForm(data);
}

/** Uploads a new profile picture and returns its URL. */
export async function uploadAvatar(file: File): Promise<string | null> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await http.post<ProfileApiResponse>(
    "/profile/avatar",
    form,
    {
      // Let the browser set the multipart boundary.
      headers: { "Content-Type": undefined },
    },
  );
  const url = data.avatarUrl ?? null;
  useAuthStore.getState().setAvatar(url);
  return url;
}

/** Removes the picture; the UI falls back to the user's initial. */
export async function removeAvatar(): Promise<void> {
  await http.delete("/profile/avatar");
  useAuthStore.getState().setAvatar(null);
}

export async function updateProfile(
  payload: ProfileForm,
): Promise<ProfileForm> {
  const { data } = await http.put<ProfileApiResponse>("/profile", {
    username: payload.name,
    email: payload.email,
  });
  return {
    ...payload,
    name: data.username,
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

/** The backend user id of the signed-in user (used to mark "mine" records). */
export async function getMyUserId(): Promise<string> {
  const { data } = await http.get<ProfileApiResponse>("/profile");
  return data.id;
}
