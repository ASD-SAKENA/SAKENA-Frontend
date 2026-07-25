"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { requestKeys } from "@/api/requests";
import {
  getBuildingLedger,
  getBuildingWalletBalance,
  getMyWalletBalance,
  getWallet,
  recordBuildingTransaction,
  settleServiceRequest,
  walletKeys,
} from "@/api/wallet";

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

export function useSettleRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settleServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      queryClient.invalidateQueries({ queryKey: walletKeys.me });
    },
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

export function useRecordBuildingTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recordBuildingTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
  });
}
