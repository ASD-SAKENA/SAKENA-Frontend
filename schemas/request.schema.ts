import { z } from "zod";

export const REQUEST_TYPES = ["تأسیسات", "برق", "نظافت"] as const;

export const requestSchema = z.object({
  type: z.enum(REQUEST_TYPES),
  description: z
    .string()
    .trim()
    .min(5, "شرح مشکل را کمی کامل‌تر بنویسید (حداقل ۵ کاراکتر)."),
});

export type RequestForm = z.infer<typeof requestSchema>;
