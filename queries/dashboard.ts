"use client";

import { useQuery } from "@tanstack/react-query";

import {
  dashboardKeys,
  getManagerDashboard,
  getResidentDashboard,
} from "@/api/dashboard";

const STALE = 5 * 60 * 1000;

export function useResidentDashboardQuery() {
  return useQuery({
    queryKey: dashboardKeys.resident,
    queryFn: getResidentDashboard,
    staleTime: STALE,
  });
}

export function useManagerDashboardQuery() {
  return useQuery({
    queryKey: dashboardKeys.manager,
    queryFn: getManagerDashboard,
    staleTime: STALE,
  });
}
