import { z } from "zod";

export const FACILITY_ICONS = [
  { value: "fitness_center", label: "سالن ورزش" },
  { value: "pool", label: "استخر" },
  { value: "meeting_room", label: "سالن همایش" },
  { value: "deck", label: "آلاچیق" },
  { value: "spa", label: "سونا و اسپا" },
  { value: "sports_tennis", label: "زمین بازی" },
  { value: "local_parking", label: "پارکینگ مهمان" },
] as const;

export const facilitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "نام امکان را وارد کنید.")
    .max(150, "نام حداکثر ۱۵۰ کاراکتر است."),
  icon: z.string().trim().min(1, "آیکون را انتخاب کنید."),
});

export type FacilityForm = z.infer<typeof facilitySchema>;
