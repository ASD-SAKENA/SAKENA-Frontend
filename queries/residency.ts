"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  endResidency,
  getBuildingResidencies,
  getMyResidency,
  residencyKeys,
  startResidency,
} from "@/api/residency";
import { unitKeys } from "@/api/units";

import type { StartResidencyApiPayload } from "@/types/residency.api.type";

const STALE = 5 * 60 * 1000;

export function useMyResidencyQuery() {
  return useQuery({
    queryKey: residencyKeys.mine,
    queryFn: getMyResidency,
    staleTime: STALE,
  });
}

export function useBuildingResidenciesQuery(buildingId: string | null) {
  return useQuery({
    queryKey: residencyKeys.byBuilding(buildingId ?? ""),
    queryFn: () => getBuildingResidencies(buildingId ?? ""),
    enabled: buildingId !== null,
    staleTime: STALE,
  });
}

function useInvalidateResidencies() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: residencyKeys.all });
    // The units table renders resident names, so it refreshes with them.
    queryClient.invalidateQueries({ queryKey: unitKeys.all });
  };
}

export function useStartResidencyMutation() {
  const invalidate = useInvalidateResidencies();
  return useMutation({
    mutationFn: ({
      apartmentId,
      payload,
    }: {
      apartmentId: string;
      payload: StartResidencyApiPayload;
    }) => startResidency(apartmentId, payload),
    onSuccess: invalidate,
  });
}

export function useEndResidencyMutation() {
  const invalidate = useInvalidateResidencies();
  return useMutation({
    mutationFn: endResidency,
    onSuccess: invalidate,
  });
}
