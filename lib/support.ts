import type { StatusColor } from "@/types/app.type";
import type {
  TicketCategoryApi,
  TicketStatusApi,
} from "@/types/support.api.type";

/** Backend status → Persian label and badge colour, used by both roles. */
export const TICKET_STATUS_META: Record<
  TicketStatusApi,
  { label: string; color: StatusColor }
> = {
  AWAITING_REPLY: { label: "در انتظار پاسخ", color: "warning" },
  IN_PROGRESS: { label: "در حال پاسخ", color: "info" },
  ANSWERED: { label: "اتمام پاسخ", color: "success" },
};

export const TICKET_CATEGORY_META: Record<
  TicketCategoryApi,
  { label: string; icon: string }
> = {
  COMPLAINT: { label: "شکایت", icon: "error" },
  CRITICISM: { label: "انتقاد", icon: "campaign" },
  SUGGESTION: { label: "پیشنهاد", icon: "lightbulb" },
};

/** The order the resident sees when opening a ticket. */
export const TICKET_CATEGORIES: TicketCategoryApi[] = [
  "COMPLAINT",
  "CRITICISM",
  "SUGGESTION",
];

/** Status filters for the manager's queue; `undefined` means everything. */
export const TICKET_STATUS_FILTERS: {
  value: TicketStatusApi | undefined;
  label: string;
}[] = [
  { value: undefined, label: "همه" },
  { value: "AWAITING_REPLY", label: "در انتظار پاسخ" },
  { value: "IN_PROGRESS", label: "در حال پاسخ" },
  { value: "ANSWERED", label: "اتمام پاسخ" },
];

/** How the manager sees the person who raised a ticket. */
export function raiserLabel(
  raisedByName: string | null,
  raisedByUnit: string | null,
): string {
  if (raisedByName === null) return "ساکن ناشناس";
  return raisedByUnit === null
    ? raisedByName
    : `${raisedByName} · واحد ${raisedByUnit}`;
}
