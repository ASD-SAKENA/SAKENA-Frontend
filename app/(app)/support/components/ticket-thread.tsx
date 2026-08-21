"use client";

import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { StatusBadge } from "@/components/app/status-badge";

import {
  useMarkTicketAnsweredMutation,
  useTicketThreadQuery,
} from "@/queries/support";

import {
  raiserLabel,
  TICKET_CATEGORY_META,
  TICKET_STATUS_META,
} from "@/lib/support";

import { TicketComposer } from "./ticket-composer";
import { TicketMessageBubble } from "./ticket-message-bubble";

interface Props {
  ticketId: string;
  isManager: boolean;
}

export function TicketThread({ ticketId, isManager }: Props) {
  const { data, isLoading } = useTicketThreadQuery(ticketId);
  const markAnswered = useMarkTicketAnsweredMutation();

  if (isLoading || !data) {
    return (
      <div className="flex flex-1 items-center justify-center text-[13px] text-app-muted">
        در حال بارگذاری گفتگو…
      </div>
    );
  }

  const { ticket, messages } = data;
  const status = TICKET_STATUS_META[ticket.status];
  const category = TICKET_CATEGORY_META[ticket.category];

  const handleMarkAnswered = () => {
    if (markAnswered.isPending) return;
    markAnswered.mutate(ticketId, {
      onSuccess: () => toast.success("تیکت به‌عنوان پاسخ‌داده‌شده ثبت شد"),
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-app-border bg-app-surface px-4 py-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <AppIcon name={category.icon} className="size-[19px] text-app-gold" />
          <span className="text-[14px] font-bold">{ticket.subject}</span>
          <StatusBadge color={status.color}>{status.label}</StatusBadge>
          <span className="flex-1" />
          {isManager && ticket.status !== "ANSWERED" ? (
            <AppButton
              variant="outline"
              onClick={handleMarkAnswered}
              disabled={markAnswered.isPending}
              className="h-[36px] px-3.5 text-[12.5px]"
            >
              <AppIcon name="check" className="size-[17px]" />
              اتمام پاسخ
            </AppButton>
          ) : null}
        </div>
        <div className="mt-1.5 text-[12px] text-app-muted">
          {category.label}
          {isManager
            ? ` · ${raiserLabel(ticket.raisedByName, ticket.raisedByUnit)}`
            : ticket.anonymous
              ? " · ارسال‌شده به‌صورت ناشناس"
              : ""}
        </div>
      </header>

      <div className="sk-scroll flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto bg-app-bg px-4 py-4">
        {messages.map((message) => (
          <TicketMessageBubble key={message.id} message={message} />
        ))}
      </div>

      <TicketComposer
        ticketId={ticketId}
        hint={
          ticket.status === "ANSWERED"
            ? "این تیکت پاسخ داده شده است؛ با ارسال پیام تازه دوباره باز می‌شود."
            : undefined
        }
      />
    </div>
  );
}
