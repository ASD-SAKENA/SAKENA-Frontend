import { beforeEach, describe, expect, it, vi } from "vitest";

import http from "@/services/http";

import {
  deleteMessage,
  editMessage,
  getMessages,
  getMessagesSince,
  sendAttachment,
  sendMessage,
} from "./chat";

vi.mock("@/services/http", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getMessages", () => {
  it("defaults the limit to 50", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [] });
    await getMessages("b1");
    expect(http.get).toHaveBeenCalledWith("/buildings/b1/chat/messages", {
      params: { limit: 50, before: undefined },
    });
  });

  it("accepts a custom limit and a before cursor", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [] });
    await getMessages("b1", { limit: 20, before: "2026-01-01T00:00:00Z" });
    expect(http.get).toHaveBeenCalledWith("/buildings/b1/chat/messages", {
      params: { limit: 20, before: "2026-01-01T00:00:00Z" },
    });
  });
});

describe("getMessagesSince", () => {
  it("gets the polling tail after a timestamp", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [] });
    await getMessagesSince("b1", "2026-01-01T00:00:00Z");
    expect(http.get).toHaveBeenCalledWith("/buildings/b1/chat/messages/since", {
      params: { since: "2026-01-01T00:00:00Z" },
    });
  });
});

describe("sendMessage", () => {
  it("posts the message body", async () => {
    vi.mocked(http.post).mockResolvedValue({ data: { id: "m1" } });
    await sendMessage("b1", "سلام");
    expect(http.post).toHaveBeenCalledWith("/buildings/b1/chat/messages", {
      body: "سلام",
    });
  });
});

describe("sendAttachment", () => {
  it("posts multipart form data with kind/caption/duration as params", async () => {
    vi.mocked(http.post).mockResolvedValue({ data: { id: "m1" } });
    const file = new File(["data"], "note.webm", { type: "audio/webm" });

    await sendAttachment("b1", "VOICE", file, {
      caption: "یادداشت",
      durationSeconds: 12,
    });

    expect(http.post).toHaveBeenCalledWith(
      "/buildings/b1/chat/messages/attachments",
      expect.any(FormData),
      {
        params: { kind: "VOICE", caption: "یادداشت", durationSeconds: 12 },
        headers: { "Content-Type": undefined },
      },
    );
    const [, form] = vi.mocked(http.post).mock.calls[0] as [string, FormData];
    expect(form.get("file")).toBe(file);
  });
});

describe("editMessage", () => {
  it("patches the message body", async () => {
    vi.mocked(http.patch).mockResolvedValue({ data: { id: "m1" } });
    await editMessage("b1", "m1", "متن ویرایش‌شده");
    expect(http.patch).toHaveBeenCalledWith("/buildings/b1/chat/messages/m1", {
      body: "متن ویرایش‌شده",
    });
  });
});

describe("deleteMessage", () => {
  it("deletes the message", async () => {
    vi.mocked(http.delete).mockResolvedValue({ data: { id: "m1" } });
    await deleteMessage("b1", "m1");
    expect(http.delete).toHaveBeenCalledWith("/buildings/b1/chat/messages/m1");
  });
});
