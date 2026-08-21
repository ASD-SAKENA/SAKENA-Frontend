/** Response shapes of the Sakena backend (`/api/v1`). */

export type ApiRole = "RESIDENT" | "MANAGER" | "STAFF";

export interface AuthApiResponse {
  token: string;
  username: string;
  role: string;
}

export interface ProfileApiResponse {
  id: string;
  username: string;
  mobile: string;
  email: string;
  role: ApiRole;
  createdAt: string;
  active: boolean;
  /** Short-lived URL, or null when the user has not set a picture. */
  avatarUrl?: string | null;
}
