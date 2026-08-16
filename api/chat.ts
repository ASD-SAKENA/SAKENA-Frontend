import http from "@/services/http";

import type {
  ChatMessageApiKind,
  ChatMessageApiResponse,
} from "@/types/chat.api.type";

export const chatKeys = {
  all: ["chat"] as const,
  messages: (buildingId: string) => ["chat", "messages", buildingId] as const,
};

function messagesPath(buildingId: string): string {
  return `/buildings/${buildingId}/chat/messages`;
}

/** The newest page of history, oldest-first; pass `before` to page further back. */
export async function getMessages(
  buildingId: string,
  options: { limit?: number; before?: string } = {},
): Promise<ChatMessageApiResponse[]> {
  const { data } = await http.get<ChatMessageApiResponse[]>(
    messagesPath(buildingId),
    { params: { limit: options.limit ?? 50, before: options.before } },
  );
  return data;
}

/** Messages sent after `since` — the polling tail. */
export async function getMessagesSince(
  buildingId: string,
  since: string,
): Promise<ChatMessageApiResponse[]> {
  const { data } = await http.get<ChatMessageApiResponse[]>(
    `${messagesPath(buildingId)}/since`,
    { params: { since } },
  );
  return data;
}

export async function sendMessage(
  buildingId: string,
  body: string,
): Promise<ChatMessageApiResponse> {
  const { data } = await http.post<ChatMessageApiResponse>(
    messagesPath(buildingId),
    { body },
  );
  return data;
}

export async function sendAttachment(
  buildingId: string,
  kind: Exclude<ChatMessageApiKind, "TEXT">,
  file: File,
  options: { caption?: string; durationSeconds?: number } = {},
): Promise<ChatMessageApiResponse> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await http.post<ChatMessageApiResponse>(
    `${messagesPath(buildingId)}/attachments`,
    form,
    {
      params: {
        kind,
        caption: options.caption,
        durationSeconds: options.durationSeconds,
      },
      // Let the browser set the multipart boundary.
      headers: { "Content-Type": undefined },
    },
  );
  return data;
}

export async function editMessage(
  buildingId: string,
  messageId: string,
  body: string,
): Promise<ChatMessageApiResponse> {
  const { data } = await http.patch<ChatMessageApiResponse>(
    `${messagesPath(buildingId)}/${messageId}`,
    { body },
  );
  return data;
}

export async function deleteMessage(
  buildingId: string,
  messageId: string,
): Promise<ChatMessageApiResponse> {
  const { data } = await http.delete<ChatMessageApiResponse>(
    `${messagesPath(buildingId)}/${messageId}`,
  );
  return data;
}
