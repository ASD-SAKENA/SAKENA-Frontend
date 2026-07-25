"use client";

import { useFacilitiesQuery } from "@/queries/reserve";

import { useReserveStore } from "@/stores/reserve.store";

import type { Facility } from "@/types/reserve.type";

/**
 * The facilities list plus the effective selection: the explicitly selected
 * facility if it still exists, otherwise the first facility (or null while
 * the list is empty/loading).
 */
export function useSelectedFacility(): {
  facilities: Facility[];
  selected: Facility | null;
} {
  const { data: facilities = [] } = useFacilitiesQuery();
  const selFacilityId = useReserveStore((s) => s.selFacilityId);

  const selected =
    facilities.find((f) => f.id === selFacilityId) ?? facilities[0] ?? null;

  return { facilities, selected };
}
