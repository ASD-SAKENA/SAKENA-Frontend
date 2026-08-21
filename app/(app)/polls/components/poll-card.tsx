"use client";

import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { StatusBadge } from "@/components/app/status-badge";

import {
  useClosePollMutation,
  useVotePollMutation,
  useWithdrawVoteMutation,
} from "@/queries/polls";

import { formatFaDate } from "@/lib/format-date";
import { toFaDigits } from "@/lib/persian-number";
import { cn } from "@/lib/utils";

import type { PollApiResponse } from "@/types/polls.api.type";

interface Props {
  poll: PollApiResponse;
  /** Managers moderate and always see live tallies; they never vote. */
  canModerate: boolean;
  /** Only residents cast or withdraw a vote. */
  canVote: boolean;
}

export function PollCard({ poll, canModerate, canVote }: Props) {
  const vote = useVotePollMutation();
  const withdraw = useWithdrawVoteMutation();
  const closePoll = useClosePollMutation();

  // Managers see live results; residents see them after voting or when closed.
  const showResults = canModerate || poll.hasVoted || !poll.open;
  const interactive = canVote && poll.open && !poll.hasVoted;

  const handleVote = (optionId: string) => {
    if (!interactive || vote.isPending) return;
    vote.mutate(
      { pollId: poll.id, optionId },
      { onSuccess: () => toast.success("رأی شما ثبت شد. سپاس از مشارکت شما!") },
    );
  };

  return (
    <div className="rounded-2xl border border-app-border bg-app-surface p-5 shadow-[var(--ap-shadow-sm)]">
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <span className="flex-1 text-[15px] font-bold text-app-fg">
          {poll.question}
        </span>
        <StatusBadge color={poll.open ? "success" : "steel"}>
          {poll.open ? "باز" : "بسته‌شده"}
        </StatusBadge>
        {canModerate && poll.open ? (
          <button
            type="button"
            onClick={() =>
              closePoll.mutate(poll.id, {
                onSuccess: () => toast.success("نظرسنجی بسته شد"),
              })
            }
            className="text-[12.5px] font-semibold text-app-danger"
          >
            بستن
          </button>
        ) : null}
      </div>

      {canModerate && poll.open ? (
        <p className="mb-3 text-[12.5px] text-app-muted">
          شما به‌عنوان مدیر رأی نمی‌دهید؛ نتیجه به‌صورت زنده نمایش داده می‌شود.
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        {poll.options.map((option) => {
          const chosen = poll.myOptionId === option.optionId;

          return (
            <button
              key={option.optionId}
              type="button"
              disabled={!interactive || vote.isPending}
              onClick={() => handleVote(option.optionId)}
              className={cn(
                "relative overflow-hidden rounded-xl border px-3.5 py-2.5 text-right transition-colors",
                chosen
                  ? "border-app-gold bg-[var(--ap-gold-soft)]"
                  : "border-app-border bg-app-surface2",
                interactive && "hover:border-app-gold",
                !interactive && "cursor-default",
              )}
            >
              {showResults ? (
                <span
                  aria-hidden
                  className="absolute inset-y-0 right-0 bg-[color-mix(in_srgb,var(--ap-gold)_14%,transparent)]"
                  style={{ width: `${option.percentage}%` }}
                />
              ) : null}

              <span className="relative flex items-center gap-2">
                {chosen ? (
                  <AppIcon
                    name="check_circle"
                    className="size-[17px] text-app-gold"
                  />
                ) : null}
                <span className="flex-1 text-[13.5px] font-semibold text-app-fg">
                  {option.label}
                </span>
                {showResults ? (
                  <span className="text-[12.5px] text-app-muted">
                    {toFaDigits(Math.round(option.percentage))}٪ ·{" "}
                    {toFaDigits(option.votes)} رأی
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-app-muted">
        <AppIcon name="groups" className="size-[16px]" />
        <span>{toFaDigits(poll.totalVotes)} رأی</span>
        <span>· {formatFaDate(poll.createdAt)}</span>
        {canVote && poll.hasVoted && poll.open ? (
          <AppButton
            variant="ghost"
            className="mr-auto h-8 px-2 text-[12.5px]"
            disabled={withdraw.isPending}
            onClick={() =>
              withdraw.mutate(poll.id, {
                onSuccess: () => toast.success("رأی شما پس گرفته شد"),
              })
            }
          >
            پس گرفتن رأی
          </AppButton>
        ) : poll.hasVoted ? (
          <span className="mr-auto text-app-success">رأی شما ثبت شده است</span>
        ) : null}
      </div>
    </div>
  );
}
