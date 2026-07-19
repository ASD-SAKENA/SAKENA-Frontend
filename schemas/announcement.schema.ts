import { z } from "zod";

export const announcementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "عنوان اطلاعیه را وارد کنید (حداقل ۳ کاراکتر).")
    .max(200, "عنوان حداکثر ۲۰۰ کاراکتر است."),
  body: z
    .string()
    .trim()
    .min(10, "متن اطلاعیه را کامل‌تر بنویسید (حداقل ۱۰ کاراکتر).")
    .max(4000, "متن حداکثر ۴۰۰۰ کاراکتر است."),
});

export type AnnouncementForm = z.infer<typeof announcementSchema>;
