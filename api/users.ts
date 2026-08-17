import http from "@/services/http";

import type {
  UserApiRole,
  UserSummaryApiResponse,
} from "@/types/users.api.type";

export const userKeys = {
  all: ["users"] as const,
  list: (role?: UserApiRole) => ["users", "list", role ?? ""] as const,
};

export async function getUsers(
  role?: UserApiRole,
): Promise<UserSummaryApiResponse[]> {
  const { data } = await http.get<UserSummaryApiResponse[]>("/users", {
    params: role ? { role } : undefined,
  });
  return data;
}

export async function updateUserStatus(
  id: string,
  active: boolean,
): Promise<UserSummaryApiResponse> {
  const { data } = await http.patch<UserSummaryApiResponse>(
    `/users/${id}/status`,
    { active },
  );
  return data;
}

export async function updateUserSpecialty(
  id: string,
  specialty: string | null,
): Promise<UserSummaryApiResponse> {
  const { data } = await http.patch<UserSummaryApiResponse>(
    `/users/${id}/specialty`,
    { specialty },
  );
  return data;
}

/** `managedBuildingId` is required when `role` is MANAGER, ignored otherwise. */
export async function updateUserRole(
  id: string,
  role: UserApiRole,
  managedBuildingId?: string,
): Promise<UserSummaryApiResponse> {
  const { data } = await http.patch<UserSummaryApiResponse>(
    `/users/${id}/role`,
    { role, managedBuildingId },
  );
  return data;
}
