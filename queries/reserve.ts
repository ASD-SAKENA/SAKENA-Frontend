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
  reserveKeys,
  updateFacility,
} from "@/api/reserve";

import type { FacilityApiPayload } from "@/types/reserve.api.type";

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
) {
  const { data: myUserId = null } = useMyUserIdQuery();
  return useQuery({
    queryKey: reserveKeys.bookings(facilityId ?? "", weekOffset),
    queryFn: () => getBookings(facilityId ?? "", weekOffset, myUserId),
    enabled: facilityId !== null,
    staleTime: 30 * 1000,
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
    }: {
      facilityId: string;
      weekOffset: number;
      day: number;
      start: number;
      dur: number;
    }) => createBooking(facilityId, weekOffset, day, start, dur),
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
