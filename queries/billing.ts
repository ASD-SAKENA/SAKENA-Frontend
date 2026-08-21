"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addChargeItem,
  billingKeys,
  closeChargePeriod,
  createChargePeriod,
  deleteChargePeriod,
  getChargeItems,
  getChargePeriods,
  getInvoiceLineItems,
  getMyInvoices,
  getOutstandingInvoices,
  getPendingServiceCharges,
  getPeriodInvoices,
  getUnitInvoices,
  issueChargePeriod,
  payInvoiceFromWallet,
  registerInvoicePayment,
  removeChargeItem,
} from "@/api/billing";
import { walletKeys } from "@/api/wallet";

import type { AddChargeItemApiPayload } from "@/types/billing.api.type";

const STALE = 5 * 60 * 1000;

export function useChargePeriodsQuery(buildingId?: string) {
  return useQuery({
    queryKey: billingKeys.periods(buildingId),
    queryFn: () => getChargePeriods(buildingId),
    staleTime: STALE,
  });
}

export function useChargeItemsQuery(periodId: string | null) {
  return useQuery({
    queryKey: billingKeys.items(periodId ?? ""),
    queryFn: () => getChargeItems(periodId ?? ""),
    enabled: periodId !== null,
    staleTime: STALE,
  });
}

export function useInvoiceLineItemsQuery(
  invoiceId: string | null,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: billingKeys.invoiceItems(invoiceId ?? ""),
    queryFn: () => getInvoiceLineItems(invoiceId ?? ""),
    enabled: invoiceId !== null && (options?.enabled ?? true),
    staleTime: STALE,
  });
}

export function usePendingServiceChargesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: billingKeys.pendingServiceCharges,
    queryFn: getPendingServiceCharges,
    staleTime: STALE,
    enabled: options?.enabled,
  });
}

export function usePeriodInvoicesQuery(periodId: string | null) {
  return useQuery({
    queryKey: billingKeys.invoices(periodId ?? ""),
    queryFn: () => getPeriodInvoices(periodId ?? ""),
    enabled: periodId !== null,
    staleTime: STALE,
  });
}

export function useUnitInvoicesQuery(apartmentId: string | null) {
  return useQuery({
    queryKey: billingKeys.unitInvoices(apartmentId ?? ""),
    queryFn: () => getUnitInvoices(apartmentId ?? ""),
    enabled: apartmentId !== null,
    staleTime: STALE,
  });
}

export function useMyInvoicesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: billingKeys.myInvoices,
    queryFn: getMyInvoices,
    staleTime: STALE,
    enabled: options?.enabled,
  });
}

export function useOutstandingInvoicesQuery(
  periodId?: string | null,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: billingKeys.outstandingInvoices(periodId ?? undefined),
    queryFn: () => getOutstandingInvoices(periodId ?? undefined),
    staleTime: STALE,
    enabled: options?.enabled,
  });
}

function useInvalidateBilling() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: billingKeys.all });
}

export function useCreateChargePeriodMutation() {
  const invalidate = useInvalidateBilling();
  return useMutation({
    mutationFn: createChargePeriod,
    onSuccess: invalidate,
  });
}

export function useDeleteChargePeriodMutation() {
  const invalidate = useInvalidateBilling();
  return useMutation({
    mutationFn: deleteChargePeriod,
    onSuccess: invalidate,
  });
}

export function useAddChargeItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      periodId,
      payload,
    }: {
      periodId: string;
      payload: AddChargeItemApiPayload;
    }) => addChargeItem(periodId, payload),
    onSuccess: (_data, { periodId }) => {
      // Only refresh this period's lines — a full billing invalidate remounts
      // the draft form mid-reset and breaks the next submit.
      queryClient.invalidateQueries({ queryKey: billingKeys.items(periodId) });
    },
  });
}

export function useRemoveChargeItemMutation() {
  const invalidate = useInvalidateBilling();
  return useMutation({
    mutationFn: ({ periodId, itemId }: { periodId: string; itemId: string }) =>
      removeChargeItem(periodId, itemId),
    onSuccess: invalidate,
  });
}

export function useIssueChargePeriodMutation() {
  const invalidate = useInvalidateBilling();
  return useMutation({
    mutationFn: issueChargePeriod,
    onSuccess: invalidate,
  });
}

export function useCloseChargePeriodMutation() {
  const invalidate = useInvalidateBilling();
  return useMutation({
    mutationFn: closeChargePeriod,
    onSuccess: invalidate,
  });
}

export function useRegisterInvoicePaymentMutation() {
  const invalidate = useInvalidateBilling();
  return useMutation({
    mutationFn: ({
      invoiceId,
      amount,
    }: {
      invoiceId: string;
      amount: number;
    }) => registerInvoicePayment(invoiceId, amount),
    onSuccess: invalidate,
  });
}

export function usePayInvoiceFromWalletMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      invoiceId,
      amount,
    }: {
      invoiceId: string;
      amount?: number;
    }) => payInvoiceFromWallet(invoiceId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
  });
}
