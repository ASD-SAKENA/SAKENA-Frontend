"use client";

import { useState } from "react";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";

import { usePollsQuery } from "@/queries/polls";

import { useAuthStore } from "@/stores/auth.store";

import { PollCard } from "./components/poll-card";
import { PollModal } from "./components/poll-modal";

export default function PollsPage() {
  const { data: polls = [] } = usePollsQuery();
  const role = useAuthStore((s) => s.user?.role);
  const [composerOpen, setComposerOpen] = useState(false);
  const isManager = role === "manager";

  return (
    <div className="sk-page flex max-w-[820px] flex-col gap-3.5">
      {isManager ? (
        <div className="flex justify-end">
          <AppButton variant="gold" onClick={() => setComposerOpen(true)}>
            <AppIcon name="add" className="size-[19px]" />
            ایجاد نظرسنجی
          </AppButton>
          <PollModal
            open={composerOpen}
            onClose={() => setComposerOpen(false)}
          />
        </div>
      ) : null}

      {polls.length === 0 ? (
        <div className="rounded-2xl border border-app-border bg-app-surface p-8 text-center text-[13.5px] text-app-muted">
          نظرسنجی فعالی وجود ندارد.
        </div>
      ) : null}

      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} canModerate={isManager} />
      ))}
    </div>
  );
}
