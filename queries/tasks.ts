"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  completeTask,
  getStaffSummary,
  getStaffTasks,
  taskKeys,
} from "@/api/tasks";

const STALE = 5 * 60 * 1000;

export function useStaffTasksQuery() {
  return useQuery({
    queryKey: taskKeys.staff,
    queryFn: getStaffTasks,
    staleTime: STALE,
  });
}

export function useStaffSummaryQuery() {
  return useQuery({
    queryKey: taskKeys.summary,
    queryFn: getStaffSummary,
    staleTime: STALE,
  });
}

export function useCompleteTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
