import { z } from "zod";

const amountField = z
  .string()
  .trim()
  .regex(/^\d+$/, "مبلغ باید عدد (تومان) باشد.")
  .refine((value) => Number(value) > 0, "مبلغ باید بزرگ‌تر از صفر باشد.");

export const invoicePaymentSchema = z.object({
  amount: amountField,
  transactionReference: z
    .string()
    .trim()
    .min(3, "شماره پیگیری تراکنش را وارد کنید.")
    .max(100, "شماره پیگیری حداکثر ۱۰۰ کاراکتر است."),
});

export type InvoicePaymentForm = z.infer<typeof invoicePaymentSchema>;

export const topUpSchema = z.object({
  amount: amountField,
});

export type TopUpForm = z.infer<typeof topUpSchema>;

export const rejectPaymentSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, "دلیل رد را وارد کنید.")
    .max(500, "دلیل رد حداکثر ۵۰۰ کاراکتر است."),
});

export type RejectPaymentForm = z.infer<typeof rejectPaymentSchema>;
