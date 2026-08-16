import { describe, expect, it } from "vitest";

import { pollSchema, splitOptions } from "./poll.schema";

describe("splitOptions", () => {
  it("splits on newlines and trims each option", () => {
    expect(splitOptions("  گزینه یک  \nگزینه دو\n")).toEqual([
      "گزینه یک",
      "گزینه دو",
    ]);
  });

  it("drops blank lines", () => {
    expect(splitOptions("گزینه یک\n\n\nگزینه دو")).toEqual([
      "گزینه یک",
      "گزینه دو",
    ]);
  });
});

describe("pollSchema", () => {
  it("accepts a question with 2+ unique options", () => {
    const result = pollSchema.safeParse({
      question: "بهترین زمان برای مجمع عمومی کی است؟",
      options: "صبح\nعصر",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a question shorter than 5 characters", () => {
    expect(
      pollSchema.safeParse({ question: "کم", options: "الف\nب" }).success,
    ).toBe(false);
  });

  it("rejects fewer than 2 options", () => {
    expect(
      pollSchema.safeParse({
        question: "سؤال آزمایشی کافی است؟",
        options: "فقط یک گزینه",
      }).success,
    ).toBe(false);
  });

  it("rejects more than 10 options", () => {
    const options = Array.from({ length: 11 }, (_, i) => `گزینه ${i}`).join(
      "\n",
    );
    expect(
      pollSchema.safeParse({ question: "سؤال آزمایشی کافی است؟", options })
        .success,
    ).toBe(false);
  });

  it("rejects duplicate options", () => {
    expect(
      pollSchema.safeParse({
        question: "سؤال آزمایشی کافی است؟",
        options: "تکراری\nتکراری",
      }).success,
    ).toBe(false);
  });
});
