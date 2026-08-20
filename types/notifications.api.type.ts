/** Response shapes of the Sakena backend notification endpoints. */

export type NotificationTypeApi =
  | "ANNOUNCEMENT"
  | "SERVICE_REQUEST"
  | "BILLING"
  | "SYSTEM";

export interface NotificationApiResponse {
  id: string;
  title: string;
  body: string;
  type: NotificationTypeApi;
  href: string | null;
  createdAt: string;
  readAt: string | null;
  unread: boolean;
}

export interface UnreadCountApiResponse {
  count: number;
}
