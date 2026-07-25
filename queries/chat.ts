"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  chatKeys,
  deleteMessage,
  editMessage,
  getMessages,
  sendAttachment,
  sendMessage,
} from "@/api/chat";

import type { ChatMessageApiKind } from "@/types/chat.api.type";

/** The chat tail is polled; a short interval keeps it feeling live. */
const POLL_INTERVAL = 5 * 1000;

export function useChatMessagesQuery(buildingId: string | null) {
  return useQuery({
    queryKey: chatKeys.messages(buildingId ?? ""),
    queryFn: () => getMessages(buildingId ?? ""),
    enabled: buildingId !== null,
    staleTime: 0,
    refetchInterval: POLL_INTERVAL,
  });
}

function useInvalidateChat(buildingId: string | null) {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: chatKeys.messages(buildingId ?? ""),
    });
}

export function useSendMessageMutation(buildingId: string | null) {
  const invalidate = useInvalidateChat(buildingId);
  return useMutation({
    mutationFn: (body: string) => sendMessage(buildingId ?? "", body),
    onSuccess: invalidate,
  });
}

export function useSendAttachmentMutation(buildingId: string | null) {
  const invalidate = useInvalidateChat(buildingId);
  return useMutation({
    mutationFn: ({
      kind,
      file,
      caption,
      durationSeconds,
    }: {
      kind: Exclude<ChatMessageApiKind, "TEXT">;
      file: File;
      caption?: string;
      durationSeconds?: number;
    }) =>
      sendAttachment(buildingId ?? "", kind, file, {
        caption,
        durationSeconds,
      }),
    onSuccess: invalidate,
  });
}

export function useEditMessageMutation(buildingId: string | null) {
  const invalidate = useInvalidateChat(buildingId);
  return useMutation({
    mutationFn: ({ messageId, body }: { messageId: string; body: string }) =>
      editMessage(buildingId ?? "", messageId, body),
    onSuccess: invalidate,
  });
}

export function useDeleteMessageMutation(buildingId: string | null) {
  const invalidate = useInvalidateChat(buildingId);
  return useMutation({
    mutationFn: (messageId: string) =>
      deleteMessage(buildingId ?? "", messageId),
    onSuccess: invalidate,
  });
}
