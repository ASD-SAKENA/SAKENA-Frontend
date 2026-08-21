"use client";

import { AppIcon } from "@/components/app/app-icon";
import { StatusBadge } from "@/components/app/status-badge";

import { formatFaDate } from "@/lib/format-date";
import {
  raiserLabel,
  TICKET_CATEGORY_META,
  TICKET_STATUS_META,
} from "@/lib/support";
import { cn } from "@/lib/utils";

import type { TicketApiResponse } from "@/types/support.api.type";

interface Props {
  tickets: TicketApiResponse[];
  selectedId: string | null;
  isManager: boolean;
  onSelect: (ticketId: string) => void;
}

export function TicketList({
  tickets,
  selectedId,
  isManager,
  onSelect,
}: Props) {
  if (tickets.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-[13px] text-app-muted">
        {isManager
          ? "هنوز تیکتی از ساکنین ثبت نشده است."
          : "هنوز تیکتی ثبت نکرده‌اید."}
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {tickets.map((ticket) => {
        const status = TICKET_STATUS_META[ticket.status];
        const category = TICKET_CATEGORY_META[ticket.category];
        const active = ticket.id === selectedId;
        return (
          <li key={ticket.id}>
            <button
              type="button"
              onClick={() => onSelect(ticket.id)}
              className={cn(
                "w-full border-b border-app-border px-4 py-3 text-right transition-colors",
                active
                  ? "bg-[var(--ap-gold-soft)]"
                  : "bg-transparent hover:bg-app-surface2",
              )}
            >
              <div className="flex items-center gap-2">
                <AppIcon
                  name={category.icon}
                  className="size-[17px] shrink-0 text-app-steel"
                />
                <span className="flex-1 truncate text-[13.5px] font-semibold">
                  {ticket.subject}
                </span>
                <StatusBadge color={status.color}>{status.label}</StatusBadge>
              </div>
              <div className="mt-1 truncate text-[12px] text-app-muted">
                {category.label}
                {isManager
                  ? ` · ${raiserLabel(ticket.raisedByName, ticket.raisedByUnit)}`
                  : ticket.anonymous
                    ? " · ناشناس"
                    : ""}
                {" · "}
                {formatFaDate(ticket.lastMessageAt)}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
