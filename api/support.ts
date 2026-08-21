import http from "@/services/http";

import type {
  OpenTicketApiPayload,
  ReplyApiPayload,
  TicketApiResponse,
  TicketAttachmentApiResponse,
  TicketMessageApiKind,
  TicketMessageApiResponse,
  TicketStatusApi,
  TicketThreadApiResponse,
} from "@/types/support.api.type";

export const supportKeys = {
  all: ["support"] as const,
  mine: ["support", "mine"] as const,
  building: (status?: string) =>
    ["support", "building", status ?? "all"] as const,
  thread: (ticketId: string) => ["support", "thread", ticketId] as const,
};

export async function openTicket(
  payload: OpenTicketApiPayload,
): Promise<TicketApiResponse> {
  const { data } = await http.post<TicketApiResponse>(
    "/support-tickets",
    payload,
  );
  return data;
}

/** The signed-in resident's own tickets, freshest conversation first. */
export async function getMyTickets(): Promise<TicketApiResponse[]> {
  const { data } = await http.get<TicketApiResponse[]>("/support-tickets/mine");
  return data;
}

/** The managed building's tickets, optionally narrowed by status. */
export async function getBuildingTickets(
  status?: TicketStatusApi,
): Promise<TicketApiResponse[]> {
  const { data } = await http.get<TicketApiResponse[]>("/support-tickets", {
    params: { status },
  });
  return data;
}

export async function getTicketThread(
  ticketId: string,
): Promise<TicketThreadApiResponse> {
  const { data } = await http.get<TicketThreadApiResponse>(
    `/support-tickets/${ticketId}`,
  );
  return data;
}

export async function replyToTicket(
  ticketId: string,
  payload: ReplyApiPayload,
): Promise<TicketMessageApiResponse> {
  const { data } = await http.post<TicketMessageApiResponse>(
    `/support-tickets/${ticketId}/messages`,
    payload,
  );
  return data;
}

/**
 * Uploads the bytes first; the returned key is then referenced by a reply, so
 * a failed upload never leaves an empty message in the thread.
 */
export async function uploadTicketAttachment(
  ticketId: string,
  kind: Exclude<TicketMessageApiKind, "TEXT">,
  file: File,
): Promise<TicketAttachmentApiResponse> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await http.post<TicketAttachmentApiResponse>(
    `/support-tickets/${ticketId}/attachments`,
    form,
    {
      params: { kind },
      // Let the browser set the multipart boundary.
      headers: { "Content-Type": undefined },
    },
  );
  return data;
}

export async function markTicketAnswered(
  ticketId: string,
): Promise<TicketApiResponse> {
  const { data } = await http.patch<TicketApiResponse>(
    `/support-tickets/${ticketId}/answer`,
  );
  return data;
}
