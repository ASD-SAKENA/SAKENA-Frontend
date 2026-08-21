import { describe, expect, it } from "vitest";

import { openTicketSchema, ticketReplySchema } from "./support.schema";

const valid = {
  category: "COMPLAINT" as const,
  subject: "سر و صدای واحد بالا",
  body: "هر شب تا دیروقت صدای بلند می‌آید و خواب بچه‌ها مختل می‌شود.",
  anonymous: false,
};

describe("openTicketSchema", () => {
  it("accepts a complete ticket", () => {
    expect(openTicketSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a subject and a reasonably complete body", () => {
    expect(openTicketSchema.safeParse({ ...valid, subject: "ا" }).success).toBe(
      false,
    );
    expect(
      openTicketSchema.safeParse({ ...valid, body: "کوتاه" }).success,
    ).toBe(false);
  });

  it("rejects a subject longer than the backend column", () => {
    expect(
      openTicketSchema.safeParse({ ...valid, subject: "x".repeat(151) })
        .success,
    ).toBe(false);
  });

  it("carries the anonymous choice through", () => {
    const parsed = openTicketSchema.parse({ ...valid, anonymous: true });
    expect(parsed.anonymous).toBe(true);
  });
});

describe("ticketReplySchema", () => {
  it("accepts a reply", () => {
    expect(ticketReplySchema.safeParse({ body: "پیگیری می‌کنم" }).success).toBe(
      true,
    );
  });

  it("rejects an empty reply", () => {
    expect(ticketReplySchema.safeParse({ body: "   " }).success).toBe(false);
  });

  it("caps the body at the backend's 2000-character limit", () => {
    // The chat schema allows 4000; reusing it here would pass validation and
    // then fail at the API.
    expect(
      ticketReplySchema.safeParse({ body: "x".repeat(2001) }).success,
    ).toBe(false);
    expect(
      ticketReplySchema.safeParse({ body: "x".repeat(2000) }).success,
    ).toBe(true);
  });
});
