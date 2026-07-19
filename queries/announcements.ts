"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  announcementKeys,
  createAnnouncement,
  getAnnouncements,
} from "@/api/announcements";

export function useAnnouncementsQuery() {
  return useQuery({
    queryKey: announcementKeys.list,
    queryFn: getAnnouncements,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAnnouncementMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.list });
    },
  });
}
