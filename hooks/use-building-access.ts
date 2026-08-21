"use client";

import { useResidentDashboardQuery } from "@/queries/dashboard";
import { useBuildingsQuery } from "@/queries/units";

import { useAuthStore } from "@/stores/auth.store";

/**
 * Whether the signed-in user can hit building-scoped APIs (announcements, polls…).
 * Waits until membership is known so we never fire a request that will 403.
 */
export function useBuildingAccess() {
  const role = useAuthStore((s) => s.user?.role);
  const isResident = role === "resident";
  const isManager = role === "manager";

  const dashboard = useResidentDashboardQuery({ enabled: isResident });
  const buildings = useBuildingsQuery({ enabled: isManager });

  if (isResident) {
    return {
      /** Membership check finished (success or empty). */
      ready: dashboard.isFetched,
      hasBuilding: dashboard.data?.hasUnit === true,
    };
  }

  if (isManager) {
    return {
      ready: buildings.isFetched,
      hasBuilding: (buildings.data?.length ?? 0) > 0,
    };
  }

  return { ready: true, hasBuilding: false };
}
