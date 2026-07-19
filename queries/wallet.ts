"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { requestKeys } from "@/api/requests";
import {
  getMyWalletBalance,
  getWallet,
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
