/** Shared app-wide domain types. */

export type Role = "resident" | "manager" | "staff";

/** Semantic status colors mapped to the app palette tokens. */
export type StatusColor =
  | "gold"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "steel"
  | "muted";

export interface AppUser {
  name: string;
  role: Role;
  roleLabel: string;
  unit: string;
  initial: string;
}
