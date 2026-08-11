import { z } from "zod";

export const TENANCY_LABELS = {
  OWNER_OCCUPIER: "مالک ساکن",
  TENANT: "مستأجر",
  COMMERCIAL: "تجاری",
} as const;

export const residencySchema = z.object({
  residentId: z.string().uuid("ساکن را از فهرست انتخاب کنید."),
  tenancy: z.enum(["OWNER_OCCUPIER", "TENANT", "COMMERCIAL"]),
});

export type ResidencyForm = z.infer<typeof residencySchema>;
