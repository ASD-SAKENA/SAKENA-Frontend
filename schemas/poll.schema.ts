import { z } from "zod";

export const pollSchema = z.object({
  question: z
    .string()
    .trim()
    .min(5, "متن سؤال را کامل‌تر بنویسید.")
    .max(300, "سؤال حداکثر ۳۰۰ کاراکتر است."),
  // One option per line keeps the composer simple for the manager.
  options: z
    .string()
    .trim()
    .min(1, "گزینه‌ها را وارد کنید.")
    .refine(
      (value) => splitOptions(value).length >= 2,
      "حداقل دو گزینه لازم است (هر گزینه در یک خط).",
    )
    .refine(
      (value) => splitOptions(value).length <= 10,
      "حداکثر ۱۰ گزینه مجاز است.",
    )
    .refine((value) => {
      const options = splitOptions(value);
      return new Set(options).size === options.length;
    }, "گزینه‌ها نباید تکراری باشند."),
});

export type PollForm = z.infer<typeof pollSchema>;

/** Turns the textarea content into the option list sent to the backend. */
export function splitOptions(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
