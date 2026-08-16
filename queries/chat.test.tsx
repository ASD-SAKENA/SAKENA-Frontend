import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { chatKeys } from "@/api/chat";
import { editMessage, getMessages, sendMessage } from "@/api/chat";

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
  sendMessage: vi.fn(),
  sendAttachment: vi.fn(),
  editMessage: vi.fn(),
  deleteMessage: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useChatMessagesQuery", () => {
  it("is disabled while buildingId is null", () => {
    const { result } = renderHook(() => useChatMessagesQuery(null), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(getMessages).not.toHaveBeenCalled();
  });

  it("fetches once a buildingId is given", async () => {
    vi.mocked(getMessages).mockResolvedValue([]);
    const { result } = renderHook(() => useChatMessagesQuery("b1"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getMessages).toHaveBeenCalledWith("b1");
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
