"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  notificationKeys,
} from "@/api/notifications";

const LIST_STALE = 30 * 1000;
const COUNT_POLL = 30 * 1000;

export function useNotificationsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: notificationKeys.list,
    queryFn: getNotifications,
    staleTime: LIST_STALE,
    enabled: options?.enabled,
  });
}

export function useUnreadNotificationCountQuery(options?: {
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: getUnreadNotificationCount,
    staleTime: 0,
    refetchInterval: COUNT_POLL,
    enabled: options?.enabled,
  });
}

function useInvalidateNotifications() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: notificationKeys.all });
}

export function useMarkNotificationReadMutation() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: invalidate,
  });
}

export function useMarkAllNotificationsReadMutation() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: invalidate,
  });
}
