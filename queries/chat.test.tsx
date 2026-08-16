import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { chatKeys } from "@/api/chat";
import {
  editMessage,
  getMessages,
  getMessagesSince,
  sendMessage,
} from "@/api/chat";

import type { ChatMessageApiResponse } from "@/types/chat.api.type";

import {
  useChatMessagesQuery,
  useEditMessageMutation,
  useSendMessageMutation,
} from "./chat";
import { createTestQueryClient, createWrapper } from "./test-utils";

vi.mock("@/api/chat", () => ({
  chatKeys: {
    all: ["chat"],
    messages: (id: string) => ["chat", "messages", id],
  },
  getMessages: vi.fn(),
  getMessagesSince: vi.fn(),
  sendMessage: vi.fn(),
  sendAttachment: vi.fn(),
  editMessage: vi.fn(),
  deleteMessage: vi.fn(),
}));

function message(id: string, sentAt: string): ChatMessageApiResponse {
  return {
    id,
    buildingId: "b1",
    senderId: "u1",
    senderName: "علی",
    kind: "TEXT",
    body: `msg-${id}`,
    attachmentUrl: null,
    attachmentContentType: null,
    attachmentSizeBytes: null,
    attachmentDurationSeconds: null,
    sentAt,
    editedAt: null,
    edited: false,
    deleted: false,
    deletedAt: null,
    mine: false,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getMessagesSince).mockResolvedValue([]);
});

describe("useChatMessagesQuery", () => {
  it("does not fetch while buildingId is null", () => {
    renderHook(() => useChatMessagesQuery(null), {
      wrapper: createWrapper(),
    });
    expect(getMessages).not.toHaveBeenCalled();
  });

  it("loads the newest page once a buildingId is given", async () => {
    vi.mocked(getMessages).mockResolvedValue([
      message("1", "2026-01-01T00:00:00Z"),
    ]);
    const { result } = renderHook(() => useChatMessagesQuery("b1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.messages).toHaveLength(1));
    expect(getMessages).toHaveBeenCalledWith("b1", { limit: 50 });
  });

  it("merges newer messages from the polling tail without re-fetching the page", async () => {
    vi.mocked(getMessages).mockResolvedValue([
      message("1", "2026-01-01T00:00:00Z"),
    ]);
    vi.mocked(getMessagesSince).mockResolvedValue([
      message("2", "2026-01-01T00:01:00Z"),
    ]);
    const { result } = renderHook(() => useChatMessagesQuery("b1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.messages).toHaveLength(2));
    expect(result.current.messages.map((m) => m.id)).toEqual(["1", "2"]);
    expect(getMessages).toHaveBeenCalledTimes(1);
  });

  it("flags hasMoreOlder as false when a page comes back short", async () => {
    vi.mocked(getMessages).mockResolvedValue([
      message("1", "2026-01-01T00:00:00Z"),
    ]);
    const { result } = renderHook(() => useChatMessagesQuery("b1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.messages).toHaveLength(1));
    expect(result.current.hasMoreOlder).toBe(false);
  });

  it("loadOlder pages backwards with a before cursor and prepends the result", async () => {
    // A full-length page implies there may be more history to page back into.
    const fullPage = Array.from({ length: 50 }, (_, i) =>
      message(`p${i}`, `2026-01-01T01:${String(i).padStart(2, "0")}:00Z`),
    );
    vi.mocked(getMessages).mockResolvedValueOnce(fullPage);
    const { result } = renderHook(() => useChatMessagesQuery("b1"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.messages).toHaveLength(50));
    expect(result.current.hasMoreOlder).toBe(true);

    vi.mocked(getMessages).mockResolvedValueOnce([
      message("older", "2026-01-01T00:00:00Z"),
    ]);
    await result.current.loadOlder();

    await waitFor(() => expect(result.current.messages).toHaveLength(51));
    expect(result.current.messages[0]?.id).toBe("older");
    expect(getMessages).toHaveBeenLastCalledWith("b1", {
      limit: 50,
      before: fullPage[0]?.sentAt,
    });
  });
});

describe("useSendMessageMutation", () => {
  it("invalidates only that building's message cache", async () => {
    vi.mocked(sendMessage).mockResolvedValue({} as never);
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useSendMessageMutation("b1"), {
      wrapper: createWrapper(client),
    });
    result.current.mutate("سلام");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(vi.mocked(sendMessage).mock.calls[0]).toEqual(["b1", "سلام"]);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: chatKeys.messages("b1"),
    });
  });
});

describe("useEditMessageMutation", () => {
  it("passes buildingId/messageId/body through to the api call", async () => {
    vi.mocked(editMessage).mockResolvedValue({} as never);
    const { result } = renderHook(() => useEditMessageMutation("b1"), {
      wrapper: createWrapper(),
    });
    result.current.mutate({ messageId: "m1", body: "ویرایش‌شده" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(vi.mocked(editMessage).mock.calls[0]).toEqual([
      "b1",
      "m1",
      "ویرایش‌شده",
    ]);
  });
});
