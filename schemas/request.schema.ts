import { z } from "zod";

import { optionalDigitString } from "@/lib/latin-digits";

export const requestSchema = z.object({
  categoryGroup: z.string().min(1, "دسته را انتخاب کنید."),
  subCategory: z.string().min(1, "زیر‌دسته را انتخاب کنید."),
  title: z
    .string()
    .trim()
    .min(3, "عنوان درخواست را وارد کنید (حداقل ۳ کاراکتر)."),
  description: z
    .string()
    .trim()
    .min(5, "شرح مشکل را کمی کامل‌تر بنویسید (حداقل ۵ کاراکتر)."),
  /** Free-text detail like «راه‌پله طبقه ۳» — the unit itself comes from the residency. */
  location: z
    .string()
    .trim()
    .max(255, "جزئیات مکان حداکثر ۲۵۵ کاراکتر است.")
    .optional(),
});

export type RequestForm = z.infer<typeof requestSchema>;

/** Manager assign flow — worker id until a staff-list endpoint exists. */
export const assignWorkerSchema = z.object({
  workerId: z.string().trim().uuid("شناسه کارکن معتبر نیست."),
});

export type AssignWorkerForm = z.infer<typeof assignWorkerSchema>;

/** Staff completion report (both fields optional per backend contract). */
export const completeTaskSchema = z.object({
  completionReport: z
    .string()
    .trim()
    .max(4000, "گزارش حداکثر ۴۰۰۰ کاراکتر است.")
    .optional()
    .or(z.literal("")),
  completionCost: optionalDigitString("هزینه باید عدد (تومان) باشد."),
});

export type CompleteTaskForm = z.infer<typeof completeTaskSchema>;
