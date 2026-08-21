/** Response shapes of the Sakena backend support endpoints (`/api/v1/support-tickets`). */

export type TicketCategoryApi = "COMPLAINT" | "CRITICISM" | "SUGGESTION";

export type TicketStatusApi = "AWAITING_REPLY" | "IN_PROGRESS" | "ANSWERED";

export type TicketMessageApiKind = "TEXT" | "IMAGE" | "VOICE";

export interface TicketApiResponse {
  id: string;
  category: TicketCategoryApi;
  subject: string;
  status: TicketStatusApi;
  anonymous: boolean;
  /** Null when the viewer may not know who raised the ticket. */
  raisedByName: string | null;
  raisedByUnit: string | null;
  createdAt: string;
  lastMessageAt: string;
}

export interface TicketMessageApiResponse {
  id: string;
  kind: TicketMessageApiKind;
  body: string | null;
  authorRole: "RESIDENT" | "MANAGER";
  /** Whether the signed-in user wrote it — aligns the bubble without user ids. */
  mine: boolean;
  /** Short-lived presigned URL; null for text messages. */
  attachmentUrl: string | null;
  durationSeconds: number | null;
  sentAt: string;
}

export interface TicketThreadApiResponse {
  ticket: TicketApiResponse;
  messages: TicketMessageApiResponse[];
}

export interface OpenTicketApiPayload {
  category: TicketCategoryApi;
  subject: string;
  body: string;
  anonymous: boolean;
}

export interface TicketAttachmentApiResponse {
  storageKey: string;
  contentType: string;
  sizeBytes: number;
}

export interface ReplyApiPayload {
  body?: string;
  kind: TicketMessageApiKind;
  storageKey?: string;
  contentType?: string;
  sizeBytes?: number;
  durationSeconds?: number;
}
