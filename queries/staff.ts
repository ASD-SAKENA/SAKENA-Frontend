"use client";

import { useQuery } from "@tanstack/react-query";

import { getStaff, staffKeys } from "@/api/staff";

const STALE = 5 * 60 * 1000;

export function useStaffQuery() {
  return useQuery({
    queryKey: staffKeys.list,
    queryFn: getStaff,
    staleTime: STALE,
  });
}
