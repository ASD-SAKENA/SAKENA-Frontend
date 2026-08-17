import http from "@/services/http";

import type { UserSummaryApiResponse } from "@/types/users.api.type";

export const staffKeys = {
  list: ["staff", "list"] as const,
};

/** Active service staff, for assigning a service request — manager-only, unlike the admin-only `/users`. */
export async function getStaff(): Promise<UserSummaryApiResponse[]> {
  const { data } = await http.get<UserSummaryApiResponse[]>("/staff");
  return data;
}
