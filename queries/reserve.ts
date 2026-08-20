"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useMyUserIdQuery } from "@/queries/profile";

import {
  cancelBooking,
  createBooking,
  createFacility,
  deleteFacility,
  getBookings,
  getFacilities,
  getMyBookings,
  reserveKeys,
  updateFacility,
} from "@/api/reserve";

import type { FacilityApiPayload } from "@/types/reserve.api.type";
import type { FacilityRules } from "@/types/reserve.type";

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

export function useFacilityBookingsQuery(
  facilityId: string | null,
  weekOffset: number,
  rules: FacilityRules,
) {
  const { data: myUserId = null } = useMyUserIdQuery();
  return useQuery({
    queryKey: reserveKeys.bookings(facilityId ?? "", weekOffset),
    queryFn: () => getBookings(facilityId ?? "", weekOffset, rules, myUserId),
    enabled: facilityId !== null,
    staleTime: 30 * 1000,
  });
}

export function useMyBookingsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: reserveKeys.myBookings,
    queryFn: getMyBookings,
    staleTime: 30 * 1000,
    enabled: options?.enabled ?? true,
  });
}

function useInvalidateBookings() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: reserveKeys.bookingsRoot });
}

export function useCreateBookingMutation() {
  const invalidate = useInvalidateBookings();
  return useMutation({
    mutationFn: ({
      facilityId,
      weekOffset,
      day,
      start,
      dur,
      startHour,
    }: {
      facilityId: string;
      weekOffset: number;
      day: number;
      start: number;
      dur: number;
      startHour: number;
    }) => createBooking(facilityId, weekOffset, day, start, dur, startHour),
    onSuccess: invalidate,
  });
}

export function useCancelBookingMutation() {
  const invalidate = useInvalidateBookings();
  return useMutation({
    mutationFn: ({
      facilityId,
      bookingId,
    }: {
      facilityId: string;
      bookingId: string;
    }) => cancelBooking(facilityId, bookingId),
    onSuccess: invalidate,
  });
}
