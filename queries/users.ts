"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getUsers,
  updateUserRole,
  updateUserSpecialty,
  updateUserStatus,
  userKeys,
} from "@/api/users";

import type { UserApiRole } from "@/types/users.api.type";

const STALE = 5 * 60 * 1000;

export function useUsersQuery(role?: UserApiRole) {
  return useQuery({
    queryKey: userKeys.list(role),
    queryFn: () => getUsers(role),
    staleTime: STALE,
  });
}

export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      updateUserStatus(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUpdateUserSpecialtyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, specialty }: { id: string; specialty: string | null }) =>
      updateUserSpecialty(id, specialty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      role,
      managedBuildingId,
    }: {
      id: string;
      role: UserApiRole;
      managedBuildingId?: string;
    }) => updateUserRole(id, role, managedBuildingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
