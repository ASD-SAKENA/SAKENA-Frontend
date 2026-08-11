/** Response shapes of the Sakena backend invitation endpoints (`/api/v1/invitations`). */
import type { TenancyTypeApi } from "@/types/residency.api.type";
import type { UserApiRole } from "@/types/users.api.type";

export type InvitationChannelApi = "EMAIL" | "PHONE" | "LINK";

export type InvitationStatusApi =
  | "PENDING"
  | "ACCEPTED"
  | "REVOKED"
  | "EXPIRED";

export interface InvitationApiResponse {
  id: string;
  buildingId: string;
  channel: InvitationChannelApi;
  recipient: string | null;
  role: UserApiRole;
  apartmentId: string | null;
  tenancy: TenancyTypeApi | null;
  status: InvitationStatusApi;
  /** Shareable join link — the token is the only secret in it. */
  acceptUrl: string;
  createdAt: string;
  expiresAt: string;
  acceptedAt: string | null;
}

/** What the join screen shows before the invitee signs in. */
export interface InvitationPreviewApiResponse {
  buildingName: string;
  role: UserApiRole;
  channel: InvitationChannelApi;
  /** Masked, so the link alone never reveals the full address. */
  recipientHint: string | null;
  unitNumber: string | null;
  expiresAt: string;
}

export interface CreateInvitationApiPayload {
  channel: InvitationChannelApi;
  recipient?: string;
  role: UserApiRole;
  apartmentId?: string;
  tenancy?: TenancyTypeApi;
}
