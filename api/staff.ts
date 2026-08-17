import http from "@/services/http";

import type { StaffSummaryApiResponse } from "@/types/users.api.type";

export const staffKeys = {
  list: ["staff", "list"] as const,
};

/** Active service staff, for assigning a service request — manager-only, unlike the admin-only `/users`. */
export async function getStaff(): Promise<StaffSummaryApiResponse[]> {
  const { data } = await http.get<StaffSummaryApiResponse[]>("/staff");
  return data;
}
