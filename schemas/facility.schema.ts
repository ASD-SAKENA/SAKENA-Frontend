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

/** Grid indexes match the Persian week (0 = شنبه … 6 = جمعه). */
export const WEEK_DAY_OPTIONS = [
  { value: 0, label: "شنبه" },
  { value: 1, label: "یکشنبه" },
  { value: 2, label: "دوشنبه" },
  { value: 3, label: "سه‌شنبه" },
  { value: 4, label: "چهارشنبه" },
  { value: 5, label: "پنجشنبه" },
  { value: 6, label: "جمعه" },
] as const;

const wholeNumber = (message: string) =>
  z.string().trim().regex(/^\d+$/, message);

const HOUR_MESSAGE = "ساعت باید بین ۰ تا ۲۴ باشد.";

export const facilitySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "نام امکان را وارد کنید.")
      .max(150, "نام حداکثر ۱۵۰ کاراکتر است."),
    icon: z.string().trim().min(1, "آیکون را انتخاب کنید."),
    capacity: wholeNumber("ظرفیت باید عدد باشد.")
      .refine((value) => Number(value) >= 1, "ظرفیت باید حداقل ۱ باشد.")
      .refine((value) => Number(value) <= 1000, "ظرفیت حداکثر ۱۰۰۰ است."),
    opensAtHour: wholeNumber(HOUR_MESSAGE).refine(
      (value) => Number(value) <= 23,
      HOUR_MESSAGE,
    ),
    closesAtHour: wholeNumber(HOUR_MESSAGE).refine(
      (value) => Number(value) >= 1 && Number(value) <= 24,
      HOUR_MESSAGE,
    ),
    closedDays: z.array(z.number().int().min(0).max(6)),
    minDurationMinutes: wholeNumber("مدت باید عدد باشد.").refine(
      (value) => Number(value) >= 15,
      "کمترین مدت رزرو ۱۵ دقیقه است.",
    ),
    maxDurationMinutes: wholeNumber("مدت باید عدد باشد.").refine(
      (value) => Number(value) >= 15,
      "بیشترین مدت رزرو ۱۵ دقیقه است.",
    ),
    maxAdvanceDays: wholeNumber("تعداد روز باید عدد باشد.")
      .refine((value) => Number(value) >= 1, "حداقل یک روز آینده.")
      .refine((value) => Number(value) <= 365, "حداکثر ۳۶۵ روز."),
    maxPerResidentPerWeek: wholeNumber("سقف هفتگی باید عدد باشد."),
    hourlyPrice: wholeNumber("هزینه باید عدد باشد."),
  })
  .refine(
    (values) => Number(values.closesAtHour) > Number(values.opensAtHour),
    { path: ["closesAtHour"], message: "ساعت پایان باید بعد از شروع باشد." },
  )
  .refine(
    (values) =>
      Number(values.maxDurationMinutes) >= Number(values.minDurationMinutes),
    {
      path: ["maxDurationMinutes"],
      message: "بیشترین مدت نباید از کمترین مدت کمتر باشد.",
    },
  )
  .refine((values) => values.closedDays.length < 7, {
    path: ["closedDays"],
    message: "همه‌ی روزهای هفته نمی‌توانند تعطیل باشند.",
  });

export type FacilityForm = z.infer<typeof facilitySchema>;
