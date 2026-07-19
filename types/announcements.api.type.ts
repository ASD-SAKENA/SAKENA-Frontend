/** Response shapes of the Sakena backend announcement endpoints (`/api/v1/announcements`). */

export interface AnnouncementApiResponse {
  id: string;
  title: string;
  body: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateAnnouncementApiPayload {
  title: string;
  body: string;
}
