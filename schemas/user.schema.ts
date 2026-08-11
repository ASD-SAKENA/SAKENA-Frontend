import { z } from "zod";

export const specialtySchema = z.object({
  specialty: z
    .string()
    .trim()
    .min(2, "تخصص را وارد کنید (حداقل ۲ کاراکتر).")
    .max(100, "تخصص حداکثر ۱۰۰ کاراکتر است."),
});

export type SpecialtyForm = z.infer<typeof specialtySchema>;
