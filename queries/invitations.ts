"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  acceptInvitation,
  createInvitation,
  getBuildingMembers,
  getInvitations,
  invitationKeys,
  previewInvitation,
  revokeInvitation,
} from "@/api/invitations";
import { residencyKeys } from "@/api/residency";

import type { CreateInvitationApiPayload } from "@/types/invitations.api.type";

const STALE = 60 * 1000;

export function useInvitationPreviewQuery(token: string | null) {
  return useQuery({
    queryKey: invitationKeys.preview(token ?? ""),
    queryFn: () => previewInvitation(token ?? ""),
    enabled: token !== null && token !== "",
    // A bad or expired link is a final answer, not something to retry.
    retry: false,
    staleTime: STALE,
  });
}

export function useBuildingInvitationsQuery(buildingId: string | null) {
  return useQuery({
    queryKey: invitationKeys.byBuilding(buildingId ?? ""),
    queryFn: () => getInvitations(buildingId ?? ""),
    enabled: buildingId !== null && buildingId !== "",
    staleTime: STALE,
  });
}

export function useBuildingMembersQuery(buildingId: string | null) {
  return useQuery({
    queryKey: invitationKeys.members(buildingId ?? ""),
    queryFn: () => getBuildingMembers(buildingId ?? ""),
    enabled: buildingId !== null && buildingId !== "",
    staleTime: STALE,
  });
}

function useInvalidateInvitations() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: invitationKeys.all });
}

export function useCreateInvitationMutation() {
  const invalidate = useInvalidateInvitations();
  return useMutation({
    mutationFn: ({
      buildingId,
      payload,
    }: {
      buildingId: string;
      payload: CreateInvitationApiPayload;
    }) => createInvitation(buildingId, payload),
    onSuccess: invalidate,
  });
}

export function useRevokeInvitationMutation() {
  const invalidate = useInvalidateInvitations();
  return useMutation({
    mutationFn: revokeInvitation,
    onSuccess: invalidate,
  });
}

export function useAcceptInvitationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.all });
      // Accepting may have moved the user into a unit.
      queryClient.invalidateQueries({ queryKey: residencyKeys.all });
    },
  });
}
