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
