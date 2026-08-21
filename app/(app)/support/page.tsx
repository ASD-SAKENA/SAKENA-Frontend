"use client";

import { useState } from "react";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";

import { useBuildingTicketsQuery, useMyTicketsQuery } from "@/queries/support";

import { useAuthStore } from "@/stores/auth.store";

import { TICKET_STATUS_FILTERS } from "@/lib/support";
import { cn } from "@/lib/utils";

import type { TicketStatusApi } from "@/types/support.api.type";

import { NewTicketModal } from "./components/new-ticket-modal";
import { TicketList } from "./components/ticket-list";
import { TicketThread } from "./components/ticket-thread";

export default function SupportPage() {
  const role = useAuthStore((s) => s.user?.role);
  const isManager = role === "manager";

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TicketStatusApi | undefined>(
    undefined,
  );

  const myTickets = useMyTicketsQuery({ enabled: !isManager });
  const buildingTickets = useBuildingTicketsQuery(statusFilter, {
    enabled: isManager,
  });
  const tickets = (isManager ? buildingTickets.data : myTickets.data) ?? [];

  return (
    <div className="sk-page flex h-[calc(100dvh-140px)] min-h-[520px] gap-3.5">
      <aside className="flex w-[320px] shrink-0 flex-col overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-[var(--ap-shadow-sm)]">
        <div className="border-b border-app-border px-4 py-3">
          {isManager ? (
            <div className="flex flex-wrap gap-1.5">
              {TICKET_STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  className={cn(
                    "h-8 rounded-lg border px-2.5 text-[12px] font-semibold transition-[border-color,background,color]",
                    statusFilter === filter.value
                      ? "border-app-gold bg-[var(--ap-gold-soft)] text-app-gold"
                      : "border-app-border bg-transparent text-app-muted hover:border-app-gold",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          ) : (
            <AppButton
              variant="gold"
              onClick={() => setComposerOpen(true)}
              className="h-[40px] w-full text-[13px]"
            >
              <AppIcon name="add" className="size-[18px]" />
              ثبت شکایت یا پیشنهاد
            </AppButton>
          )}
        </div>

        <div className="sk-scroll min-h-0 flex-1 overflow-y-auto">
          <TicketList
            tickets={tickets}
            selectedId={selectedId}
            isManager={isManager}
            onSelect={setSelectedId}
          />
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-[var(--ap-shadow-sm)]">
        {selectedId === null ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2.5 text-app-muted">
            <AppIcon name="support" className="size-9" />
            <p className="text-[13px]">
              برای دیدن گفتگو، یک تیکت را از فهرست انتخاب کنید.
            </p>
          </div>
        ) : (
          <TicketThread ticketId={selectedId} isManager={isManager} />
        )}
      </section>

      {!isManager ? (
        <NewTicketModal
          open={composerOpen}
          onClose={() => setComposerOpen(false)}
        />
      ) : null}
    </div>
  );
}
