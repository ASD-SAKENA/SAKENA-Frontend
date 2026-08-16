"use client";

import { useEffect, useRef } from "react";

import { messageDayLabel } from "@/lib/chat";

import type { ChatMessageApiResponse } from "@/types/chat.api.type";

import { MessageBubble } from "./message-bubble";

interface Props {
  messages: ChatMessageApiResponse[];
  canModerate: boolean;
  onEdit: (message: ChatMessageApiResponse) => void;
  onDelete: (message: ChatMessageApiResponse) => void;
  hasMoreOlder: boolean;
  isLoadingOlder: boolean;
  onLoadOlder: () => void;
}

/** Below this distance from the bottom, a new message still auto-scrolls. */
const NEAR_BOTTOM_PX = 120;

export function MessageList({
  messages,
  canModerate,
  onEdit,
  onDelete,
  hasMoreOlder,
  isLoadingOlder,
  onLoadOlder,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const wasNearBottom = useRef(true);
  const prevScrollHeight = useRef(0);
  const prevMessageCount = useRef(0);
  const lastId = messages.at(-1)?.id;

  // A poll only pulls the scroll view along when the reader is already at
  // the bottom — scrolling up to read history must not get yanked away.
  useEffect(() => {
    const grew = messages.length > prevMessageCount.current;
    prevMessageCount.current = messages.length;
    if (grew && wasNearBottom.current) {
      bottomRef.current?.scrollIntoView({ block: "end" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastId]);

  // Prepending older history must not shift what the reader is looking at.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || prevScrollHeight.current === 0) return;
    container.scrollTop += container.scrollHeight - prevScrollHeight.current;
    prevScrollHeight.current = 0;
  }, [messages]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    wasNearBottom.current = distanceFromBottom < NEAR_BOTTOM_PX;
  };

  const handleLoadOlder = () => {
    if (scrollRef.current)
      prevScrollHeight.current = scrollRef.current.scrollHeight;
    onLoadOlder();
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-center text-[13.5px] text-app-muted">
        هنوز پیامی در گفتگوی ساختمان ثبت نشده است. اولین پیام را شما بفرستید.
      </div>
    );
  }

  // A day separator is shown whenever the day changes from the previous message.
  const rows = messages.map((message, index) => {
    const day = messageDayLabel(message.sentAt);
    const previous = messages[index - 1];
    return {
      message,
      day,
      showDay:
        previous === undefined || messageDayLabel(previous.sentAt) !== day,
    };
  });

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="sk-scroll flex flex-1 flex-col gap-2.5 overflow-y-auto p-4"
    >
      {hasMoreOlder ? (
        <div className="flex justify-center pb-1">
          <button
            type="button"
            onClick={handleLoadOlder}
            disabled={isLoadingOlder}
            className="rounded-full border border-app-border bg-app-surface2 px-3.5 py-1.5 text-[12px] font-semibold text-app-muted transition-colors hover:text-app-fg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingOlder ? "در حال بارگذاری…" : "بارگذاری پیام‌های قدیمی‌تر"}
          </button>
        </div>
      ) : null}
      {rows.map(({ message, day, showDay }) => {
        return (
          <div key={message.id} className="flex flex-col gap-2.5">
            {showDay ? (
              <div className="flex justify-center">
                <span className="rounded-full bg-app-surface2 px-3 py-1 text-[11.5px] text-app-muted">
                  {day}
                </span>
              </div>
            ) : null}
            <MessageBubble
              message={message}
              canModerate={canModerate}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
