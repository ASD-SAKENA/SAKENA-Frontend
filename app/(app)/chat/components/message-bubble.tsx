"use client";

import Image from "next/image";

import { AppIcon } from "@/components/app/app-icon";
import { Avatar } from "@/components/app/avatar";

import { formatDuration, messageTime, senderInitial } from "@/lib/chat";
import { cn } from "@/lib/utils";

import type { ChatMessageApiResponse } from "@/types/chat.api.type";

interface Props {
  message: ChatMessageApiResponse;
  /** Managers may remove anyone's message. */
  canModerate: boolean;
  onEdit: (message: ChatMessageApiResponse) => void;
  onDelete: (message: ChatMessageApiResponse) => void;
}

export function MessageBubble({
  message,
  canModerate,
  onEdit,
  onDelete,
}: Props) {
  const mine = message.mine;
  const canEdit = mine && message.kind === "TEXT" && !message.deleted;
  const canDelete = (mine || canModerate) && !message.deleted;

  if (message.deleted) {
    return (
      <div className={cn("flex", mine ? "justify-start" : "justify-end")}>
        <div className="rounded-2xl border border-dashed border-app-border px-3.5 py-2 text-[12.5px] text-app-muted">
          این پیام حذف شده است
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        mine ? "justify-start" : "justify-end",
      )}
    >
      {!mine ? (
        <Avatar
          src={message.senderAvatarUrl}
          initial={senderInitial(message.senderName)}
          size={32}
          alt={message.senderName}
          className="bg-app-surface2 text-app-steel"
        />
      ) : null}

      <div
        className={cn(
          "group max-w-[min(75%,520px)] rounded-2xl px-3.5 py-2.5 shadow-[var(--ap-shadow-sm)]",
          mine
            ? "bg-[var(--ap-gold-soft)] text-app-fg"
            : "border border-app-border bg-app-surface text-app-fg",
        )}
      >
        {!mine ? (
          <div className="mb-1 text-[12px] font-bold text-app-gold">
            {message.senderName}
          </div>
        ) : null}

        {message.kind === "IMAGE" && message.attachmentUrl ? (
          <a
            href={message.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-1.5 block overflow-hidden rounded-xl"
          >
            <Image
              src={message.attachmentUrl}
              alt={message.body ?? "تصویر پیام"}
              width={320}
              height={240}
              unoptimized
              className="h-auto w-full max-w-[320px] object-cover"
            />
          </a>
        ) : null}

        {message.kind === "VOICE" && message.attachmentUrl ? (
          <div className="mb-1.5 flex items-center gap-2.5">
            <AppIcon name="graphic_eq" className="size-[18px] text-app-gold" />
            <audio
              controls
              src={message.attachmentUrl}
              className="h-9 max-w-[240px]"
            />
            {message.attachmentDurationSeconds ? (
              <span className="text-[11.5px] text-app-muted">
                {formatDuration(message.attachmentDurationSeconds)}
              </span>
            ) : null}
          </div>
        ) : null}

        {message.body ? (
          <p className="text-[13.5px] leading-[1.9] whitespace-pre-wrap">
            {message.body}
          </p>
        ) : null}

        <div className="mt-1 flex items-center gap-2 text-[11px] text-app-muted">
          <span>{messageTime(message.sentAt)}</span>
          {message.edited ? <span>· ویرایش‌شده</span> : null}
          <span className="flex-1" />
          {canEdit ? (
            <button
              type="button"
              onClick={() => onEdit(message)}
              aria-label="ویرایش پیام"
              className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <AppIcon
                name="edit"
                className="size-[15px] hover:text-app-gold"
              />
            </button>
          ) : null}
          {canDelete ? (
            <button
              type="button"
              onClick={() => onDelete(message)}
              aria-label="حذف پیام"
              className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <AppIcon
                name="delete"
                className="size-[15px] hover:text-app-danger"
              />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
