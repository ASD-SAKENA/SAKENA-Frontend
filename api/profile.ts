import type { ProfileForm } from "@/schemas/profile.schema";

export const profileKeys = {
  all: ["profile"] as const,
};

export async function getProfile(): Promise<ProfileForm> {
  // Mock: the real call will be `http.get<ProfileForm>("/profile/")`.
  return {
    name: "مهندس رضایی",
    mobile: "۰۹۱۲ ۳۴۵ ۶۷۸۹",
    email: "rezaei@mail.com",
    unit: "۱۲ — بلوک B",
  };
}

export async function updateProfile(
  payload: ProfileForm,
): Promise<ProfileForm> {
  // Mock: the real call will be `http.patch<ProfileForm>("/profile/", payload)`.
  return payload;
}
