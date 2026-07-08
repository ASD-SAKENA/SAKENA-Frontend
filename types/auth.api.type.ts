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
  email: string;
  role: ApiRole;
  createdAt: string;
  active: boolean;
}
