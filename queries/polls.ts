"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  closePoll,
  createPoll,
  getPolls,
  pollKeys,
  votePoll,
} from "@/api/polls";

const STALE = 60 * 1000;

export function usePollsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: pollKeys.list,
    queryFn: getPolls,
    staleTime: STALE,
    enabled: options?.enabled,
  });
}

function useInvalidatePolls() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: pollKeys.all });
}

export function useCreatePollMutation() {
  const invalidate = useInvalidatePolls();
  return useMutation({
    mutationFn: createPoll,
    onSuccess: invalidate,
  });
}

export function useVotePollMutation() {
  const invalidate = useInvalidatePolls();
  return useMutation({
    mutationFn: ({ pollId, optionId }: { pollId: string; optionId: string }) =>
      votePoll(pollId, optionId),
    onSuccess: invalidate,
  });
}

export function useClosePollMutation() {
  const invalidate = useInvalidatePolls();
  return useMutation({
    mutationFn: closePoll,
    onSuccess: invalidate,
  });
}
