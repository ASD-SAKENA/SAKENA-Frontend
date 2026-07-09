import { z } from "zod";

export const roleEnum = z.enum(["resident", "manager", "staff"]);

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "ایمیل یا شماره موبایل را وارد کنید."),
  password: z.string().min(1, "رمز عبور را وارد کنید."),
  role: roleEnum,
  remember: z.boolean().optional(),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string().trim().min(2, "نام و نام خانوادگی را وارد کنید."),
  mobile: z
    .string()
    .trim()
    .regex(/^0?9\d{9}$/, "شماره موبایل معتبر نیست."),
  buildingCode: z.string().trim().optional(),
  // Required by the backend register endpoint (used for password recovery).
  email: z
    .string()
    .trim()
    .min(1, "ایمیل را وارد کنید.")
    .email("ایمیل معتبر نیست."),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد."),
  role: roleEnum,
  agree: z.literal(true, {
    message: "برای ادامه باید قوانین را بپذیرید.",
  }),
});

export type SignupForm = z.infer<typeof signupSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "ایمیل را وارد کنید.")
    .email("ایمیل معتبر نیست."),
});

export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد."),
    confirmPassword: z.string().min(1, "تکرار رمز عبور را وارد کنید."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "تکرار رمز عبور مطابقت ندارد.",
    path: ["confirmPassword"],
  });

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
