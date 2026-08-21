"use client";

import { useMemo, useState } from "react";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { NoUnitNotice } from "@/components/app/no-unit-notice";

import { useResidentDashboardQuery } from "@/queries/dashboard";
import { usePollsQuery } from "@/queries/polls";

import { useAuthStore } from "@/stores/auth.store";

import { cn } from "@/lib/utils";

import { PollCard } from "./components/poll-card";
import { PollModal } from "./components/poll-modal";

type PollFilter = "all" | "open" | "closed";

const FILTERS: { key: PollFilter; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "open", label: "باز" },
  { key: "closed", label: "بسته‌شده" },
];

export default function PollsPage() {
  const role = useAuthStore((s) => s.user?.role);
  const isManager = role === "manager";
  const isResident = role === "resident";

  const { data: dashboard } = useResidentDashboardQuery({
    enabled: isResident,
  });
  const { data: polls = [] } = usePollsQuery({
    enabled: !isResident || dashboard?.hasUnit === true,
  });
  const [composerOpen, setComposerOpen] = useState(false);
  const [filter, setFilter] = useState<PollFilter>("all");

  const filtered = useMemo(() => {
    if (filter === "open") return polls.filter((poll) => poll.open);
    if (filter === "closed") return polls.filter((poll) => !poll.open);
    return polls;
  }, [polls, filter]);

  if (isResident && dashboard && !dashboard.hasUnit) {
    return (
      <div className="sk-page max-w-[820px]">
        <NoUnitNotice />
      </div>
    );
  }

  return (
    <div className="sk-page flex max-w-[820px] flex-col gap-3.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-app-border bg-app-surface p-1">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={cn(
                "h-9 rounded-lg px-3.5 text-[13px] font-semibold transition-colors",
                filter === item.key
                  ? "bg-app-gold text-app-gold-fg"
                  : "text-app-muted hover:text-app-fg",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {isManager ? (
          <AppButton variant="gold" onClick={() => setComposerOpen(true)}>
            <AppIcon name="add" className="size-[19px]" />
            ایجاد نظرسنجی
          </AppButton>
        ) : null}
      </div>

      {isManager ? (
        <PollModal open={composerOpen} onClose={() => setComposerOpen(false)} />
      ) : null}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-app-border bg-app-surface p-8 text-center text-[13.5px] text-app-muted">
          {polls.length === 0
            ? "نظرسنجی‌ای وجود ندارد."
            : "در این فیلتر نظرسنجی‌ای نیست."}
        </div>
      ) : null}

      {filtered.map((poll) => (
        <PollCard
          key={poll.id}
          poll={poll}
          canModerate={isManager}
          canVote={isResident}
        />
      ))}
    </div>
  );
}
