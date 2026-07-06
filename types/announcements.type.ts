import type { StatusColor } from "@/types/app.type";

export interface Announcement {
  id: string;
  title: string;
  date: string;
  icon: string;
  color: StatusColor;
  body: string;
}
