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
