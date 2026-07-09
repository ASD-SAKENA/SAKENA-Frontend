import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(2, "نام و نام خانوادگی را وارد کنید."),
  mobile: z.string().trim().min(1, "شماره موبایل را وارد کنید."),
  email: z.string().trim().email("ایمیل معتبر نیست."),
  unit: z.string().trim().min(1, "واحد را وارد کنید."),
});

export type ProfileForm = z.infer<typeof profileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "رمز عبور فعلی را وارد کنید."),
  newPassword: z.string().min(8, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد."),
});

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
