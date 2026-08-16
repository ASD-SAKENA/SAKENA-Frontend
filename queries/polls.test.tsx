import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { pollKeys } from "@/api/polls";
import { createPoll, getPolls, votePoll } from "@/api/polls";

import {
  useCreatePollMutation,
  usePollsQuery,
  useVotePollMutation,
} from "./polls";
import { createTestQueryClient, createWrapper } from "./test-utils";

vi.mock("@/api/polls", () => ({
  pollKeys: { all: ["polls"], list: ["polls", "list"] },
  getPolls: vi.fn(),
  createPoll: vi.fn(),
  votePoll: vi.fn(),
  closePoll: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("usePollsQuery", () => {
  it("fetches the poll list", async () => {
    vi.mocked(getPolls).mockResolvedValue([]);
    const { result } = renderHook(() => usePollsQuery(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getPolls).toHaveBeenCalledTimes(1);
  });
});

describe("useCreatePollMutation", () => {
  it("invalidates polls.all on success", async () => {
    vi.mocked(createPoll).mockResolvedValue({} as never);
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useCreatePollMutation(), {
      wrapper: createWrapper(client),
    });
    result.current.mutate({ question: "سؤال؟", options: ["الف", "ب"] });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: pollKeys.all });
  });
});

describe("useVotePollMutation", () => {
  it("passes pollId/optionId through to the api call", async () => {
    vi.mocked(votePoll).mockResolvedValue({} as never);
    const { result } = renderHook(() => useVotePollMutation(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({ pollId: "p1", optionId: "opt-1" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(vi.mocked(votePoll).mock.calls[0]).toEqual(["p1", "opt-1"]);
  });
});
