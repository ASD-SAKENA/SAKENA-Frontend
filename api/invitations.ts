import http from "@/services/http";

import type {
  BuildingMemberApiResponse,
  CreateInvitationApiPayload,
  InvitationApiResponse,
  InvitationPreviewApiResponse,
} from "@/types/invitations.api.type";

export const invitationKeys = {
  all: ["invitations"] as const,
  byBuilding: (buildingId: string) =>
    ["invitations", "building", buildingId] as const,
  members: (buildingId: string) =>
    ["invitations", "members", buildingId] as const,
  preview: (token: string) => ["invitations", "preview", token] as const,
};

/** Readable before signing in — the join screen calls this first. */
export async function previewInvitation(
  token: string,
): Promise<InvitationPreviewApiResponse> {
  const { data } = await http.get<InvitationPreviewApiResponse>(
    "/invitations/preview",
    { params: { token }, suppressToast: true },
  );
  return data;
}

export async function acceptInvitation(
  token: string,
): Promise<InvitationApiResponse> {
  const { data } = await http.post<InvitationApiResponse>(
    "/invitations/accept",
    undefined,
    { params: { token } },
  );
  return data;
}

export async function getInvitations(
  buildingId: string,
): Promise<InvitationApiResponse[]> {
  const { data } = await http.get<InvitationApiResponse[]>("/invitations", {
    params: { buildingId },
  });
  return data;
}

/** People who joined the building, and the unit each one occupies. */
export async function getBuildingMembers(
  buildingId: string,
): Promise<BuildingMemberApiResponse[]> {
  const { data } = await http.get<BuildingMemberApiResponse[]>(
    "/invitations/members",
    { params: { buildingId } },
  );
  return data;
}

export async function createInvitation(
  buildingId: string,
  payload: CreateInvitationApiPayload,
): Promise<InvitationApiResponse> {
  const { data } = await http.post<InvitationApiResponse>(
    `/invitations/buildings/${buildingId}`,
    payload,
  );
  return data;
}

export async function revokeInvitation(
  id: string,
): Promise<InvitationApiResponse> {
  const { data } = await http.delete<InvitationApiResponse>(
    `/invitations/${id}`,
  );
  return data;
}
