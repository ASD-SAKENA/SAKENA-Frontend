"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { billingKeys } from "@/api/billing";
import { requestKeys } from "@/api/requests";
import {
  confirmPayment,
  fundWallet,
  getBuildingLedger,
  getBuildingPayments,
  getBuildingWalletBalance,
  getMyWalletBalance,
  getPaymentSubmissions,
  getPendingPayments,
  getWallet,
  recordBuildingTransaction,
  rejectPayment,
  settleServiceRequest,
  submitInvoicePayment,
  walletKeys,
} from "@/api/wallet";

import type {
  PaymentApiStatus,
  SubmitInvoicePaymentPayload,
} from "@/types/wallet.api.type";

const STALE = 5 * 60 * 1000;

export function useWalletQuery() {
  return useQuery({
    queryKey: walletKeys.all,
    queryFn: getWallet,
    staleTime: STALE,
  });
}

export function useMyWalletQuery() {
  return useQuery({
    queryKey: walletKeys.me,
    queryFn: getMyWalletBalance,
    staleTime: STALE,
  });
}

export function useBuildingWalletQuery() {
  return useQuery({
    queryKey: walletKeys.building,
    queryFn: getBuildingWalletBalance,
    staleTime: STALE,
  });
}

export function useBuildingLedgerQuery() {
  return useQuery({
    queryKey: walletKeys.buildingLedger,
    queryFn: getBuildingLedger,
    staleTime: STALE,
  });
}

export function usePaymentSubmissionsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: walletKeys.submissions,
    queryFn: getPaymentSubmissions,
    staleTime: STALE,
    enabled: options?.enabled,
  });
}

export function usePendingPaymentsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: walletKeys.pendingPayments,
    queryFn: getPendingPayments,
    staleTime: STALE,
    enabled: options?.enabled,
  });
}

export function useBuildingPaymentsQuery(
  filters?: { status?: PaymentApiStatus; periodId?: string },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: walletKeys.buildingPayments(filters?.status, filters?.periodId),
    queryFn: () => getBuildingPayments(filters),
    staleTime: STALE,
    enabled: options?.enabled,
  });
}

function useInvalidateWallet() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: walletKeys.all });
}

export function useSubmitInvoicePaymentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitInvoicePaymentPayload) =>
      submitInvoicePayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
      queryClient.invalidateQueries({ queryKey: billingKeys.myInvoices });
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
    },
  });
}

export function useConfirmPaymentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: confirmPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.pendingPayments });
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
    },
  });
}

export function useRejectPaymentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectPayment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.pendingPayments });
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
    },
  });
}

export function useFundWalletMutation() {
  const invalidate = useInvalidateWallet();
  return useMutation({
    mutationFn: fundWallet,
    onSuccess: invalidate,
  });
}

export function useRecordBuildingTransactionMutation() {
  const invalidate = useInvalidateWallet();
  return useMutation({
    mutationFn: recordBuildingTransaction,
    onSuccess: invalidate,
  });
}

export function useSettleRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settleServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
    },
  });
}
