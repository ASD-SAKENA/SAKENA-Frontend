"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approveRequest,
  assignRequest,
  completeRequest,
  confirmCompletion,
  createRequest,
  getManagerRequests,
  getRequestCategories,
  getResidentRequests,
  rejectCompletion,
  rejectRequest,
  requestKeys,
  startRequestProgress,
  updateRequest,
} from "@/api/requests";
import { taskKeys } from "@/api/tasks";

const STALE = 5 * 60 * 1000;

export function useResidentRequestsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: requestKeys.resident,
    queryFn: getResidentRequests,
    staleTime: STALE,
    enabled: options?.enabled,
  });
}

export function useManagerRequestsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: requestKeys.manager,
    queryFn: getManagerRequests,
    staleTime: STALE,
    enabled: options?.enabled,
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

export function useUpdateRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof updateRequest>[1];
    }) => updateRequest(id, payload),
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

export function useRejectRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectRequest,
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

export function useConfirmCompletionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, score }: { id: string; score: number }) =>
      confirmCompletion(id, score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useRejectCompletionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rejectCompletion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
