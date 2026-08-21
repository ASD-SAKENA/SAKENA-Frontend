"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getBuildingTickets,
  getMyTickets,
  getTicketThread,
  markTicketAnswered,
  openTicket,
  replyToTicket,
  supportKeys,
  uploadTicketAttachment,
} from "@/api/support";

import type {
  ReplyApiPayload,
  TicketMessageApiKind,
  TicketStatusApi,
} from "@/types/support.api.type";

const STALE = 30 * 1000;

export function useMyTicketsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: supportKeys.mine,
    queryFn: getMyTickets,
    staleTime: STALE,
    enabled: options?.enabled ?? true,
  });
}

export function useBuildingTicketsQuery(
  status?: TicketStatusApi,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: supportKeys.building(status),
    queryFn: () => getBuildingTickets(status),
    staleTime: STALE,
    enabled: options?.enabled ?? true,
  });
}

export function useTicketThreadQuery(ticketId: string | null) {
  return useQuery({
    queryKey: supportKeys.thread(ticketId ?? ""),
    queryFn: () => getTicketThread(ticketId ?? ""),
    enabled: ticketId !== null,
    staleTime: STALE,
  });
}

function useInvalidateSupport() {
  const queryClient = useQueryClient();
  // A reply changes the ticket's status and its place in both lists, so the
  // whole feature is refreshed rather than just the open thread.
  return () => queryClient.invalidateQueries({ queryKey: supportKeys.all });
}

export function useOpenTicketMutation() {
  const invalidate = useInvalidateSupport();
  return useMutation({ mutationFn: openTicket, onSuccess: invalidate });
}

export function useReplyToTicketMutation() {
  const invalidate = useInvalidateSupport();
  return useMutation({
    mutationFn: ({
      ticketId,
      payload,
    }: {
      ticketId: string;
      payload: ReplyApiPayload;
    }) => replyToTicket(ticketId, payload),
    onSuccess: invalidate,
  });
}

/** Uploads the bytes, then posts the reply that references them. */
export function useSendTicketAttachmentMutation() {
  const invalidate = useInvalidateSupport();
  return useMutation({
    mutationFn: async ({
      ticketId,
      kind,
      file,
      durationSeconds,
    }: {
      ticketId: string;
      kind: Exclude<TicketMessageApiKind, "TEXT">;
      file: File;
      durationSeconds?: number;
    }) => {
      const stored = await uploadTicketAttachment(ticketId, kind, file);
      return replyToTicket(ticketId, {
        kind,
        storageKey: stored.storageKey,
        contentType: stored.contentType,
        sizeBytes: stored.sizeBytes,
        durationSeconds,
      });
    },
    onSuccess: invalidate,
  });
}

export function useMarkTicketAnsweredMutation() {
  const invalidate = useInvalidateSupport();
  return useMutation({
    mutationFn: markTicketAnswered,
    onSuccess: invalidate,
  });
}
