import { beforeEach, describe, expect, it, vi } from "vitest";

import http from "@/services/http";

import { closePoll, createPoll, getPolls, votePoll } from "./polls";

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

describe("getPolls", () => {
  it("reads the poll list", async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [] });
    await getPolls();
    expect(http.get).toHaveBeenCalledWith("/polls");
  });
});

describe("createPoll", () => {
  it("posts the payload", async () => {
    vi.mocked(http.post).mockResolvedValue({ data: { id: "p1" } });
    const payload = { question: "سؤال؟", options: ["الف", "ب"] };
    await createPoll(payload);
    expect(http.post).toHaveBeenCalledWith("/polls", payload);
  });
});

describe("votePoll", () => {
  it("posts the chosen option", async () => {
    vi.mocked(http.post).mockResolvedValue({ data: { id: "p1" } });
    await votePoll("p1", "opt-1");
    expect(http.post).toHaveBeenCalledWith("/polls/p1/votes", {
      optionId: "opt-1",
    });
  });
});

describe("closePoll", () => {
  it("posts to the close sub-route", async () => {
    vi.mocked(http.post).mockResolvedValue({ data: { id: "p1" } });
    await closePoll("p1");
    expect(http.post).toHaveBeenCalledWith("/polls/p1/close");
  });
});
