"use client";

import { useCallback, useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  chatKeys,
  deleteMessage,
  editMessage,
  getMessages,
  getMessagesSince,
  sendAttachment,
  sendMessage,
} from "@/api/chat";

import type {
  ChatMessageApiKind,
  ChatMessageApiResponse,
} from "@/types/chat.api.type";

/** The chat tail is polled; a short interval keeps it feeling live. */
const POLL_INTERVAL = 5 * 1000;
const PAGE_SIZE = 50;

function mergeById(
  existing: ChatMessageApiResponse[],
  incoming: ChatMessageApiResponse[],
): ChatMessageApiResponse[] {
  if (incoming.length === 0) return existing;
  const byId = new Map(existing.map((m) => [m.id, m]));
  for (const message of incoming) byId.set(message.id, message);
  return [...byId.values()].sort((a, b) => a.sentAt.localeCompare(b.sentAt));
}

/**
 * Loads the newest page once, then polls only for messages sent since the
 * last one seen — a full building history is never re-fetched on a timer.
 * `loadOlder` pages further back on demand via `before`.
 */
export function useChatMessagesQuery(buildingId: string | null) {
  const [messages, setMessages] = useState<ChatMessageApiResponse[]>([]);
  const [hasMoreOlder, setHasMoreOlder] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [since, setSince] = useState<string | null>(null);

  useEffect(() => {
    setMessages([]);
    setHasMoreOlder(true);
    setSince(null);
  }, [buildingId]);

  const initialPage = useQuery({
    queryKey: chatKeys.messages(buildingId ?? ""),
    queryFn: () => getMessages(buildingId ?? "", { limit: PAGE_SIZE }),
    enabled: buildingId !== null,
    staleTime: Infinity,
  });

  useEffect(() => {
    const page = initialPage.data;
    if (!page) return;
    setMessages((prev) => mergeById(prev, page));
    setHasMoreOlder(page.length >= PAGE_SIZE);
    const last = page.at(-1);
    if (last) setSince((prev) => prev ?? last.sentAt);
  }, [initialPage.data]);

  const tail = useQuery({
    queryKey: [...chatKeys.messages(buildingId ?? ""), "since"],
    queryFn: () => getMessagesSince(buildingId ?? "", since ?? ""),
    enabled: buildingId !== null && since !== null,
    refetchInterval: POLL_INTERVAL,
    staleTime: 0,
  });

  useEffect(() => {
    if (!tail.data || tail.data.length === 0) return;
    setMessages((prev) => mergeById(prev, tail.data));
    const last = tail.data.at(-1);
    if (last) setSince(last.sentAt);
  }, [tail.data]);

  const loadOlder = useCallback(async () => {
    if (buildingId === null || isLoadingOlder || !hasMoreOlder) return;
    const oldest = messages[0]?.sentAt;
    if (!oldest) return;
    setIsLoadingOlder(true);
    try {
      const older = await getMessages(buildingId, {
        limit: PAGE_SIZE,
        before: oldest,
      });
      setMessages((prev) => mergeById(prev, older));
      setHasMoreOlder(older.length >= PAGE_SIZE);
    } finally {
      setIsLoadingOlder(false);
    }
  }, [buildingId, messages, hasMoreOlder, isLoadingOlder]);

  return {
    messages,
    isLoading: initialPage.isLoading,
    hasMoreOlder,
    isLoadingOlder,
    loadOlder,
  };
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
