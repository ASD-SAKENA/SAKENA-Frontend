import { z } from "zod";

import { positiveAmountString } from "@/lib/latin-digits";

export const buildingTransactionSchema = z.object({
  direction: z.enum(["CREDIT", "DEBIT"]),
  category: z.enum([
    "CHARGE_COLLECTION",
    "WAGE_SETTLEMENT",
    "OPERATING_EXPENSE",
    "ADJUSTMENT",
  ]),
  amount: positiveAmountString(),
  description: z
    .string()
    .trim()
    .min(3, "شرح تراکنش را وارد کنید.")
    .max(300, "شرح حداکثر ۳۰۰ کاراکتر است."),
});

export type BuildingTransactionForm = z.infer<typeof buildingTransactionSchema>;
