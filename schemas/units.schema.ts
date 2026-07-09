import { z } from "zod";

export const buildingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "نام ساختمان را وارد کنید.")
    .max(150, "نام ساختمان حداکثر ۱۵۰ کاراکتر است."),
  address: z
    .string()
    .trim()
    .min(5, "آدرس را کامل‌تر وارد کنید.")
    .max(500, "آدرس حداکثر ۵۰۰ کاراکتر است."),
});

export type BuildingForm = z.infer<typeof buildingSchema>;

export const apartmentSchema = z.object({
  buildingId: z.string().uuid("ابتدا یک ساختمان انتخاب کنید."),
  unitNumber: z
    .string()
    .trim()
    .min(1, "شماره واحد را وارد کنید.")
    .max(50, "شماره واحد حداکثر ۵۰ کاراکتر است."),
  floorNumber: z.coerce
    .number({ message: "طبقه باید عدد باشد." })
    .int("طبقه باید عدد صحیح باشد.")
    .min(0, "طبقه نمی‌تواند منفی باشد."),
  areaSquareMeters: z.coerce
    .number({ message: "متراژ باید عدد باشد." })
    .positive("متراژ باید بزرگ‌تر از صفر باشد."),
  bedrooms: z.coerce
    .number({ message: "تعداد خواب باید عدد باشد." })
    .int("تعداد خواب باید عدد صحیح باشد.")
    .min(0, "تعداد خواب نمی‌تواند منفی باشد.")
    .max(20, "تعداد خواب حداکثر ۲۰ است."),
});

/** Raw field values before zod coercion (number inputs yield strings). */
export type ApartmentFormInput = z.input<typeof apartmentSchema>;
export type ApartmentForm = z.output<typeof apartmentSchema>;
