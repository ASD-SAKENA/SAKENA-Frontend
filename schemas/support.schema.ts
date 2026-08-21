import { z } from "zod";

export const openTicketSchema = z.object({
  category: z.enum(["COMPLAINT", "CRITICISM", "SUGGESTION"]),
  subject: z
    .string()
    .trim()
    .min(3, "عنوان را وارد کنید.")
    .max(150, "عنوان حداکثر ۱۵۰ کاراکتر است."),
  body: z
    .string()
    .trim()
    .min(10, "شرح موضوع را کامل‌تر بنویسید.")
    .max(2000, "متن حداکثر ۲۰۰۰ کاراکتر است."),
  anonymous: z.boolean(),
});

export type OpenTicketForm = z.infer<typeof openTicketSchema>;

/**
 * A reply's body. Capped at 2000 to match the backend's TicketMessage limit —
 * reusing the chat schema would accept 4000 here and fail at the API.
 */
export const ticketReplySchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "پاسخی بنویسید.")
    .max(2000, "متن حداکثر ۲۰۰۰ کاراکتر است."),
});

export type TicketReplyForm = z.infer<typeof ticketReplySchema>;
