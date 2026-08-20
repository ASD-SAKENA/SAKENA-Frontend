"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import { AppIcon } from "@/components/app/app-icon";

import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
  useUnreadNotificationCountQuery,
} from "@/queries/notifications";

import { useAuthStore } from "@/stores/auth.store";

import { formatFaDate } from "@/lib/format-date";
import { toFaDigits } from "@/lib/persian-number";

import type { NotificationApiResponse } from "@/types/notifications.api.type";

const TYPE_ICON: Record<NotificationApiResponse["type"], string> = {
  ANNOUNCEMENT: "campaign",
  SERVICE_REQUEST: "handyman",
  BILLING: "payments",
  SYSTEM: "notifications",
};

export function NotificationBell() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount = 0 } = useUnreadNotificationCountQuery({
    enabled: isAuthenticated,
  });
  const { data: notifications = [], isLoading } = useNotificationsQuery({
    enabled: isAuthenticated && open,
  });
  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllNotificationsReadMutation();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const iconBtn =
    "flex size-10 flex-shrink-0 items-center justify-center rounded-[10px] border border-app-border bg-app-bg text-app-fg hover:border-app-gold";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        title="اعلان‌ها"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
        className={`relative ${iconBtn}`}
      >
        <AppIcon name="notifications" className="size-[21px]" />
        {unreadCount > 0 ? (
          <span className="absolute top-1.5 right-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-app-danger px-1 text-[10px] font-bold text-white">
            {toFaDigits(Math.min(unreadCount, 99))}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="اعلان‌ها"
          className="absolute top-[calc(100%+8px)] left-0 z-40 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-[var(--ap-shadow-md)]"
        >
          <div className="flex items-center justify-between border-b border-app-border px-4 py-3">
            <div className="text-[14px] font-bold text-app-fg">اعلان‌ها</div>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
                className="text-[12px] font-semibold text-app-gold hover:underline disabled:opacity-50"
              >
                خواندن همه
              </button>
            ) : null}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-8 text-center text-[13px] text-app-muted">
                در حال بارگذاری…
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-[13px] text-app-muted">
                اعلانی ندارید
              </div>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li key={notification.id}>
                    <NotificationRow
                      notification={notification}
                      onOpen={() => {
                        if (notification.unread) {
                          markRead.mutate(notification.id);
                        }
                        setOpen(false);
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NotificationRow({
  notification,
  onOpen,
}: {
  notification: NotificationApiResponse;
  onOpen: () => void;
}) {
  const content = (
    <>
      <div
        className={`mt-0.5 flex size-8 flex-shrink-0 items-center justify-center rounded-lg ${
          notification.unread
            ? "bg-app-gold/15 text-app-gold"
            : "bg-app-surface2 text-app-muted"
        }`}
      >
        <AppIcon
          name={TYPE_ICON[notification.type]}
          className="size-[18px]"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div
            className={`text-[13px] ${
              notification.unread
                ? "font-bold text-app-fg"
                : "font-medium text-app-fg"
            }`}
          >
            {notification.title}
          </div>
          {notification.unread ? (
            <span className="mt-1 size-2 flex-shrink-0 rounded-full bg-app-danger" />
          ) : null}
        </div>
        <div className="mt-0.5 line-clamp-2 text-[12.5px] text-app-muted">
          {notification.body}
        </div>
        <div className="mt-1 text-[11.5px] text-app-muted">
          {formatFaDate(notification.createdAt)}
        </div>
      </div>
    </>
  );

  const className =
    "flex w-full gap-3 border-b border-app-border px-4 py-3 text-right transition-colors last:border-b-0 hover:bg-app-surface2";

  if (notification.href) {
    return (
      <Link href={notification.href} onClick={onOpen} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onOpen} className={className}>
      {content}
    </button>
  );
}
