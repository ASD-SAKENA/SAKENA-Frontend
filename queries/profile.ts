"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getProfile, profileKeys, updateProfile } from "@/api/profile";

const STALE = 5 * 60 * 1000;

export function useProfileQuery() {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: getProfile,
    staleTime: STALE,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}
