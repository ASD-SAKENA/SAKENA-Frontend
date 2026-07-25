"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getWallet, recordPayment, walletKeys } from "@/api/wallet";

const STALE = 5 * 60 * 1000;

export function useWalletQuery() {
  return useQuery({
    queryKey: walletKeys.all,
    queryFn: getWallet,
    staleTime: STALE,
  });
}

export function useRecordPaymentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recordPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
  });
}
