"use client";

import { useState } from "react";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { NoUnitNotice } from "@/components/app/no-unit-notice";

import { useResidentDashboardQuery } from "@/queries/dashboard";
import { usePollsQuery } from "@/queries/polls";

import { useAuthStore } from "@/stores/auth.store";

import { PollCard } from "./components/poll-card";
import { PollModal } from "./components/poll-modal";

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

  if (isResident && dashboard && !dashboard.hasUnit) {
    return (
      <div className="sk-page max-w-[820px]">
        <NoUnitNotice />
      </div>
    );
  }

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
