"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createRequest,
  getManagerRequests,
  getResidentRequests,
  requestKeys,
} from "@/api/requests";

const STALE = 5 * 60 * 1000;

export function useResidentRequestsQuery() {
  return useQuery({
    queryKey: requestKeys.resident,
    queryFn: getResidentRequests,
    staleTime: STALE,
  });
}

export function useManagerRequestsQuery() {
  return useQuery({
    queryKey: requestKeys.manager,
    queryFn: getManagerRequests,
    staleTime: STALE,
  });
}

export function useCreateRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
    },
  });
}
