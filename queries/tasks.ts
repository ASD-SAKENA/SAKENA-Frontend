"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getStaffHistory,
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

export function useStaffHistoryQuery() {
  return useQuery({
    queryKey: taskKeys.history,
    queryFn: getStaffHistory,
    staleTime: STALE,
  });
}
