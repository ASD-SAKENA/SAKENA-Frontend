import { z } from "zod";

import { positiveAmountString } from "@/lib/latin-digits";

const isoDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "تاریخ را به شکل YYYY-MM-DD وارد کنید.");

export const chargePeriodSchema = z
  .object({
    buildingId: z.string().uuid("ابتدا یک ساختمان انتخاب کنید."),
    title: z
      .string()
      .trim()
      .min(2, "عنوان دوره را وارد کنید.")
      .max(150, "عنوان حداکثر ۱۵۰ کاراکتر است."),
    type: z.enum(["MONTHLY", "QUARTERLY", "CUSTOM"]),
    startsOn: isoDate,
    endsOn: isoDate,
  })
  .refine((data) => data.endsOn > data.startsOn, {
    message: "تاریخ پایان باید بعد از شروع باشد.",
    path: ["endsOn"],
  });

export type ChargePeriodForm = z.infer<typeof chargePeriodSchema>;

export const chargeItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "عنوان هزینه را وارد کنید.")
    .max(200, "عنوان حداکثر ۲۰۰ کاراکتر است."),
  amount: positiveAmountString(),
  kind: z.enum(["RECURRING_CHARGE", "FACILITY_COST", "EXTRAORDINARY_EXPENSE"]),
  allocation: z.enum(["EQUAL", "BY_AREA"]),
});

export type ChargeItemForm = z.infer<typeof chargeItemSchema>;

export const invoicePaymentSchema = z.object({
  amount: positiveAmountString(),
});

export type InvoicePaymentForm = z.infer<typeof invoicePaymentSchema>;
