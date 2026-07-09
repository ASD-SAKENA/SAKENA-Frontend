import { z } from "zod";

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
  completionCost: z
    .string()
    .trim()
    .regex(/^\d*$/, "هزینه باید عدد (تومان) باشد.")
    .optional()
    .or(z.literal("")),
});

export type CompleteTaskForm = z.infer<typeof completeTaskSchema>;
