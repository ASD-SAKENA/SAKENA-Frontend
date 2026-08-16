import { describe, expect, it } from "vitest";

import { announcementSchema } from "./announcement.schema";

describe("announcementSchema", () => {
  it("accepts a valid announcement", () => {
    const result = announcementSchema.safeParse({
      title: "تعمیر آسانسور",
      body: "آسانسور فردا از ساعت ۹ صبح تعمیر می‌شود.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a title shorter than 3 characters", () => {
    expect(
      announcementSchema.safeParse({ title: "ab", body: "1234567890" }).success,
    ).toBe(false);
  });

  it("rejects a body shorter than 10 characters", () => {
    expect(
      announcementSchema.safeParse({ title: "عنوان", body: "کوتاه" }).success,
    ).toBe(false);
  });

  it("rejects a title longer than 200 characters", () => {
    expect(
      announcementSchema.safeParse({
        title: "a".repeat(201),
        body: "1234567890",
      }).success,
    ).toBe(false);
  });
});
