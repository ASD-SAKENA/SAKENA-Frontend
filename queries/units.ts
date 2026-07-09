"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createApartment,
  createBuilding,
  deleteApartment,
  deleteBuilding,
  getBuildings,
  getUnits,
  unitKeys,
  updateApartment,
  updateBuilding,
} from "@/api/units";

import type { ApartmentForm, BuildingForm } from "@/schemas/units.schema";

const STALE = 5 * 60 * 1000;

export function useUnitsQuery(buildingId?: string) {
  return useQuery({
    queryKey: unitKeys.list(buildingId),
    queryFn: () => getUnits(buildingId),
    staleTime: STALE,
  });
}

export function useBuildingsQuery() {
  return useQuery({
    queryKey: unitKeys.buildings,
    queryFn: getBuildings,
    staleTime: STALE,
  });
}

function useInvalidateUnits() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: unitKeys.all });
}

export function useCreateApartmentMutation() {
  const invalidate = useInvalidateUnits();
  return useMutation({
    mutationFn: createApartment,
    onSuccess: invalidate,
  });
}

export function useUpdateApartmentMutation() {
  const invalidate = useInvalidateUnits();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApartmentForm }) =>
      updateApartment(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteApartmentMutation() {
  const invalidate = useInvalidateUnits();
  return useMutation({
    mutationFn: deleteApartment,
    onSuccess: invalidate,
  });
}

export function useCreateBuildingMutation() {
  const invalidate = useInvalidateUnits();
  return useMutation({
    mutationFn: createBuilding,
    onSuccess: invalidate,
  });
}

export function useUpdateBuildingMutation() {
  const invalidate = useInvalidateUnits();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BuildingForm }) =>
      updateBuilding(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteBuildingMutation() {
  const invalidate = useInvalidateUnits();
  return useMutation({
    mutationFn: deleteBuilding,
    onSuccess: invalidate,
  });
}
