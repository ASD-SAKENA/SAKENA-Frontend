"use client";

import Image from "next/image";

import { AppIcon } from "@/components/app/app-icon";

import { formatDuration, messageTime } from "@/lib/chat";
import { cn } from "@/lib/utils";

import type { TicketMessageApiResponse } from "@/types/support.api.type";

interface Props {
  message: TicketMessageApiResponse;
}

export function TicketMessageBubble({ message }: Props) {
  const mine = message.mine;

  return (
    <div className={cn("flex", mine ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-3.5 py-2.5",
          mine
            ? "bg-app-gold text-app-gold-fg"
            : "border border-app-border bg-app-surface2 text-app-fg",
        )}
      >
        {!mine ? (
          <div className="mb-1 text-[12px] font-bold text-app-gold">
            {message.authorRole === "MANAGER" ? "مدیر ساختمان" : "ساکن"}
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
              alt="تصویر ضمیمه"
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
            {message.durationSeconds ? (
              <span className="text-[11.5px] text-app-muted">
                {formatDuration(message.durationSeconds)}
              </span>
            ) : null}
          </div>
        ) : null}

        {message.body ? (
          <p className="text-[13.5px] leading-[1.9] whitespace-pre-wrap">
            {message.body}
          </p>
        ) : null}

        <div
          className={cn(
            "mt-1 text-[11px]",
            mine ? "text-[rgba(10,14,26,0.6)]" : "text-app-muted",
          )}
        >
          {messageTime(message.sentAt)}
        </div>
      </div>
    </div>
  );
}
