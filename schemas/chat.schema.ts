import { z } from "zod";

export const chatMessageSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "پیامی بنویسید.")
    .max(4000, "پیام حداکثر ۴۰۰۰ کاراکتر است."),
});

export type ChatMessageForm = z.infer<typeof chatMessageSchema>;
