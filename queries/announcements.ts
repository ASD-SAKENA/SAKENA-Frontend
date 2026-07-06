"use client";

import { useQuery } from "@tanstack/react-query";

import { announcementKeys, getAnnouncements } from "@/api/announcements";

export function useAnnouncementsQuery() {
  return useQuery({
    queryKey: announcementKeys.list,
    queryFn: getAnnouncements,
    staleTime: 5 * 60 * 1000,
  });
}
