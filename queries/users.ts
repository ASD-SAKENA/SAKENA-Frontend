"use client";

import { useQuery } from "@tanstack/react-query";

import { getUsers, userKeys } from "@/api/users";

import type { UserApiRole } from "@/types/users.api.type";

const STALE = 5 * 60 * 1000;

export function useUsersQuery(role?: UserApiRole) {
  return useQuery({
    queryKey: userKeys.list(role),
    queryFn: () => getUsers(role),
    staleTime: STALE,
  });
}
