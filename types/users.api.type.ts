/** Response shapes of the Sakena backend user endpoints (`/api/v1/users`). */

export type UserApiRole = "RESIDENT" | "MANAGER" | "STAFF" | "ADMIN";

export interface UserSummaryApiResponse {
  id: string;
  username: string;
  email: string;
  role: UserApiRole;
  active: boolean;
  specialty: string | null;
}

/** Response shape of GET /api/v1/staff — narrower than UserSummaryApiResponse, manager-facing. */
export interface StaffSummaryApiResponse {
  id: string;
  username: string;
  specialty: string | null;
  active: boolean;
  averageRating: number | null;
}
