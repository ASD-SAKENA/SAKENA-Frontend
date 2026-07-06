"use client";

import { useQuery } from "@tanstack/react-query";

import { getUnits, unitKeys } from "@/api/units";

const STALE = 5 * 60 * 1000;

export function useUnitsQuery() {
  return useQuery({
    queryKey: unitKeys.list,
    queryFn: getUnits,
    staleTime: STALE,
  });
}
