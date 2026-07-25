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
}

export function MessageList({
  messages,
  canModerate,
  onEdit,
  onDelete,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastId = messages.at(-1)?.id;

  // Follow the conversation as it grows, the way a messenger does.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lastId]);

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
    <div className="sk-scroll flex flex-1 flex-col gap-2.5 overflow-y-auto p-4">
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
