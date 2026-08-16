import { z } from "zod";

const amountField = z
  .string()
  .trim()
  .regex(/^\d+$/, "مبلغ باید عدد (تومان) باشد.")
  .refine((value) => Number(value) > 0, "مبلغ باید بزرگ‌تر از صفر باشد.");

export const paymentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "شرح پرداخت را وارد کنید (حداقل ۳ کاراکتر).")
    .max(200, "شرح حداکثر ۲۰۰ کاراکتر است."),
  amount: amountField,
});

export type PaymentForm = z.infer<typeof paymentSchema>;

export const topUpSchema = z.object({
  amount: amountField,
});

export type TopUpForm = z.infer<typeof topUpSchema>;
