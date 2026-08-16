import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  formatDuration,
  messageDayLabel,
  messageTime,
  senderInitial,
} from "./chat";

describe("messageTime", () => {
  it("returns an empty string for an invalid date", () => {
    expect(messageTime("not-a-date")).toBe("");
  });

  it("formats a valid ISO timestamp as hh:mm with Persian digits", () => {
    expect(messageTime("2026-03-05T10:32:00Z")).toMatch(/^[۰-۹]{1,2}:[۰-۹]{2}$/);
  });
});

describe("messageDayLabel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-05T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns an empty string for an invalid date", () => {
    expect(messageDayLabel("not-a-date")).toBe("");
  });

  it("labels today as امروز", () => {
    expect(messageDayLabel(new Date("2026-03-05T08:00:00").toISOString())).toBe(
      "امروز",
    );
  });

  it("labels yesterday as دیروز", () => {
    expect(messageDayLabel(new Date("2026-03-04T08:00:00").toISOString())).toBe(
      "دیروز",
    );
  });

  it("formats older dates as a full date", () => {
    const label = messageDayLabel(new Date("2026-02-01T08:00:00").toISOString());
    expect(label).not.toBe("امروز");
    expect(label).not.toBe("دیروز");
    expect(label.length).toBeGreaterThan(0);
  });
});

describe("formatDuration", () => {
  it("formats seconds under a minute", () => {
    expect(formatDuration(7)).toBe("۰:۰۷");
  });

  it("formats minutes and seconds", () => {
    expect(formatDuration(125)).toBe("۲:۰۵");
  });

  it("formats zero", () => {
    expect(formatDuration(0)).toBe("۰:۰۰");
  });
});

describe("senderInitial", () => {
  it("returns the first character, trimmed", () => {
    expect(senderInitial("  Ali Rezaei")).toBe("A");
  });

  it("falls back to a placeholder for an empty name", () => {
    expect(senderInitial("   ")).toBe("؟");
  });
});
