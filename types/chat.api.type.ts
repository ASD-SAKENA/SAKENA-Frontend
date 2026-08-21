/** Response shapes of the Sakena backend chat endpoints (`/api/v1/buildings/{id}/chat`). */

export type ChatMessageApiKind = "TEXT" | "IMAGE" | "VOICE";

export interface ChatMessageApiResponse {
  id: string;
  buildingId: string;
  senderId: string;
  senderName: string;
  /** Short-lived URL, or null when the sender has no picture. */
  senderAvatarUrl: string | null;
  kind: ChatMessageApiKind;
  /** Null once the message is deleted. */
  body: string | null;
  /** Short-lived presigned URL; null for text and deleted messages. */
  attachmentUrl: string | null;
  attachmentContentType: string | null;
  attachmentSizeBytes: number | null;
  attachmentDurationSeconds: number | null;
  sentAt: string;
  editedAt: string | null;
  edited: boolean;
  deleted: boolean;
  deletedAt: string | null;
  /** Whether the signed-in user is the author. */
  mine: boolean;
}

export interface SendChatMessageApiPayload {
  body: string;
}
