"use client";

import { useQuery } from "@tanstack/react-query";

import { getBaseBookings, getFacilities, reserveKeys } from "@/api/reserve";

import type { FacilityKey } from "@/types/reserve.type";

const STALE = 5 * 60 * 1000;

export function useFacilitiesQuery() {
  return useQuery({
    queryKey: reserveKeys.facilities,
    queryFn: getFacilities,
    staleTime: STALE,
  });
}

export function useBaseBookingsQuery(facility: FacilityKey) {
  return useQuery({
    queryKey: reserveKeys.bookings(facility),
    queryFn: () => getBaseBookings(facility),
    staleTime: STALE,
  });
}
