"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createFacility,
  deleteFacility,
  getFacilities,
  reserveKeys,
  updateFacility,
} from "@/api/reserve";

import type { FacilityApiPayload } from "@/types/reserve.api.type";

const STALE = 5 * 60 * 1000;

export function useFacilitiesQuery() {
  return useQuery({
    queryKey: reserveKeys.facilities,
    queryFn: getFacilities,
    staleTime: STALE,
  });
}

function useInvalidateFacilities() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: reserveKeys.facilities });
}

export function useCreateFacilityMutation() {
  const invalidate = useInvalidateFacilities();
  return useMutation({
    mutationFn: createFacility,
    onSuccess: invalidate,
  });
}

export function useUpdateFacilityMutation() {
  const invalidate = useInvalidateFacilities();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: FacilityApiPayload;
    }) => updateFacility(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteFacilityMutation() {
  const invalidate = useInvalidateFacilities();
  return useMutation({
    mutationFn: deleteFacility,
    onSuccess: invalidate,
  });
}
