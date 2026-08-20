import http from "@/services/http";

import type {
  NotificationApiResponse,
  UnreadCountApiResponse,
} from "@/types/notifications.api.type";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: ["notifications", "list"] as const,
  unreadCount: ["notifications", "unread-count"] as const,
};

export async function getNotifications(): Promise<NotificationApiResponse[]> {
  const { data } = await http.get<NotificationApiResponse[]>("/notifications");
  return data;
}

export async function getUnreadNotificationCount(): Promise<number> {
  const { data } = await http.get<UnreadCountApiResponse>(
    "/notifications/unread-count",
  );
  return data.count;
}

export async function markNotificationRead(
  id: string,
): Promise<NotificationApiResponse> {
  const { data } = await http.post<NotificationApiResponse>(
    `/notifications/${id}/read`,
  );
  return data;
}

export async function markAllNotificationsRead(): Promise<void> {
  await http.post("/notifications/read-all");
}
