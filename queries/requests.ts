"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approveRequest,
  assignRequest,
  completeRequest,
  createRequest,
  getManagerRequests,
  getRequestCategories,
  getResidentRequests,
  requestKeys,
  startRequestProgress,
} from "@/api/requests";
import { taskKeys } from "@/api/tasks";

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

export function useRequestCategoriesQuery() {
  return useQuery({
    queryKey: requestKeys.categories,
    queryFn: getRequestCategories,
    staleTime: 60 * 60 * 1000,
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

export function useApproveRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
    },
  });
}

export function useAssignRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, workerId }: { id: string; workerId: string }) =>
      assignRequest(id, workerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
    },
  });
}

export function useStartProgressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startRequestProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useCompleteRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      report,
      cost,
    }: {
      id: string;
      report?: string;
      cost?: number;
    }) => completeRequest(id, report, cost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
