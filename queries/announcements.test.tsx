import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type * as AnnouncementsApi from "@/api/announcements";
import { announcementKeys } from "@/api/announcements";
import { createAnnouncement, getAnnouncements } from "@/api/announcements";

import {
  useAnnouncementsQuery,
  useCreateAnnouncementMutation,
} from "./announcements";
import { createTestQueryClient, createWrapper } from "./test-utils";

vi.mock("@/api/announcements", async () => {
  const actual = await vi.importActual<typeof AnnouncementsApi>(
    "@/api/announcements",
  );
  return {
    ...actual,
    getAnnouncements: vi.fn(),
    createAnnouncement: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useAnnouncementsQuery", () => {
  it("fetches the announcement list", async () => {
    vi.mocked(getAnnouncements).mockResolvedValue([]);
    const { result } = renderHook(() => useAnnouncementsQuery(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getAnnouncements).toHaveBeenCalledTimes(1);
  });

  it("does not fetch when disabled", async () => {
    vi.mocked(getAnnouncements).mockResolvedValue([]);
    renderHook(() => useAnnouncementsQuery({ enabled: false }), {
      wrapper: createWrapper(),
    });
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(getAnnouncements).not.toHaveBeenCalled();
  });
});

describe("useCreateAnnouncementMutation", () => {
  it("invalidates the announcement list on success", async () => {
    vi.mocked(createAnnouncement).mockResolvedValue({ id: "a1" });
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useCreateAnnouncementMutation(), {
      wrapper: createWrapper(client),
    });
    result.current.mutate({ title: "عنوان", body: "متن" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: announcementKeys.list,
    });
  });
});
