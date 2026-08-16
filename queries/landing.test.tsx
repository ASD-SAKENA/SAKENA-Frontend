import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getLandingContent } from "@/api/landing";

import { useLandingContentQuery } from "./landing";
import { createWrapper } from "./test-utils";

vi.mock("@/api/landing", () => ({
  landingKeys: { content: ["landing", "content"] },
  getLandingContent: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useLandingContentQuery", () => {
  it("fetches the landing content", async () => {
    vi.mocked(getLandingContent).mockResolvedValue({
      hero: { url: "", kpis: [], bars: [], badgeLabel: "", badgeValue: "" },
      stats: [],
      features: [],
      roles: [],
      steps: [],
      faqs: [],
      footerColumns: [],
    });
    const { result } = renderHook(() => useLandingContentQuery(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getLandingContent).toHaveBeenCalledTimes(1);
  });
});
