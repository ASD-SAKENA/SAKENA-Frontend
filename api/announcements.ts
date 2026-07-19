import http from "@/services/http";

import { formatFaDate } from "@/lib/format-date";

import type {
  AnnouncementApiResponse,
  CreateAnnouncementApiPayload,
} from "@/types/announcements.api.type";
import type { Announcement } from "@/types/announcements.type";
import type { StatusColor } from "@/types/app.type";

export const announcementKeys = {
  list: ["announcements"] as const,
};

/**
 * Icon/accent are presentation-only (the backend stores title/body); rotate
 * through a fixed palette so consecutive cards stay visually distinct.
 */
const CARD_ACCENTS: { icon: string; color: StatusColor }[] = [
  { icon: "campaign", color: "gold" },
  { icon: "info", color: "info" },
  { icon: "notifications", color: "success" },
  { icon: "priority_high", color: "warning" },
];

function toAnnouncement(
  data: AnnouncementApiResponse,
  index: number,
): Announcement {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
  return {
    id: data.id,
    title: data.title,
    body: data.body,
    date: formatFaDate(data.createdAt),
    icon: accent.icon,
    color: accent.color,
  };
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const { data } = await http.get<AnnouncementApiResponse[]>("/announcements");
  return data.map(toAnnouncement);
}

export async function createAnnouncement(
  payload: CreateAnnouncementApiPayload,
): Promise<{ id: string }> {
  const { data } = await http.post<AnnouncementApiResponse>(
    "/announcements",
    payload,
  );
  return { id: data.id };
}
