"use client";

import { useState } from "react";

import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";

import {
  useCompleteTaskMutation,
  useStaffSummaryQuery,
  useStaffTasksQuery,
} from "@/queries/tasks";

import { cn } from "@/lib/utils";

import type { StatusColor } from "@/types/app.type";
import type { StaffTask } from "@/types/tasks.type";

type StaffTab = "open" | "done" | "all";

const SUMMARY_TINT: Record<StatusColor, string> = {
  gold: "text-app-gold bg-[color-mix(in_srgb,var(--ap-gold)_14%,transparent)]",
  success:
    "text-app-success bg-[color-mix(in_srgb,var(--ap-success)_14%,transparent)]",
  warning:
    "text-app-warning bg-[color-mix(in_srgb,var(--ap-warning)_14%,transparent)]",
  danger:
    "text-app-danger bg-[color-mix(in_srgb,var(--ap-danger)_14%,transparent)]",
  info: "text-app-info bg-[color-mix(in_srgb,var(--ap-info)_14%,transparent)]",
  steel:
    "text-app-steel bg-[color-mix(in_srgb,var(--ap-steel)_14%,transparent)]",
  muted:
    "text-app-muted bg-[color-mix(in_srgb,var(--ap-muted)_14%,transparent)]",
};

const TABS: { key: StaffTab; label: string }[] = [
  { key: "open", label: "در انتظار" },
  { key: "done", label: "انجام‌شده" },
  { key: "all", label: "همه" },
];

export default function TasksPage() {
  const [tab, setTab] = useState<StaffTab>("open");
  const { data: tasks = [] } = useStaffTasksQuery();
  const { data: summary = [] } = useStaffSummaryQuery();
  const completeTask = useCompleteTaskMutation();

  const filtered = tasks.filter((t) => {
    if (tab === "open") return !t.done;
    if (tab === "done") return t.done;
    return true;
  });

  const handleDone = (task: StaffTask) => {
    completeTask.mutate(task.id, {
      onSuccess: () => {
        toast.success(`گزارش انجام کار «${task.title}» ثبت شد`);
      },
    });
  };

  return (
    <div className="sk-page grid grid-cols-1 gap-4 min-[881px]:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-3">
        <div className="mb-1 flex w-fit gap-1.5 rounded-xl border border-app-border bg-app-surface p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                tab === t.key
                  ? "bg-app-gold text-app-gold-fg"
                  : "text-app-muted hover:text-app-fg",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filtered.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-[15px] rounded-2xl border border-app-border bg-app-surface p-[18px] shadow-[var(--ap-shadow-sm)]"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-app-surface2">
              <AppIcon
                name={task.icon}
                className="size-[22px] text-app-steel"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                <span className="text-[14.5px] font-bold text-app-fg">
                  {task.title}
                </span>
                <StatusBadge color={task.priorityColor}>
                  {task.priority}
                </StatusBadge>
              </div>
              <div className="mb-2.5 text-[13px] text-app-muted">
                واحد {task.unit} · ارجاع: {task.date}
              </div>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => handleDone(task)}
                  disabled={task.done || completeTask.isPending}
                  className="flex h-9 items-center gap-1.5 rounded-[9px] bg-app-success px-3.5 text-[13px] font-semibold text-white transition-[filter] hover:brightness-[1.06] active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <AppIcon name="check" className="size-[17px]" />
                  ثبت انجام
                </button>
                <AppButton
                  variant="outline"
                  className="h-9 rounded-[9px] px-3.5 text-[13px] font-normal"
                >
                  جزئیات
                </AppButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SectionCard title="خلاصه امروز" className="h-fit">
        {summary.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 border-b border-app-border py-3 last:border-b-0"
          >
            <div
              className={cn(
                "flex size-[38px] items-center justify-center rounded-[10px]",
                SUMMARY_TINT[item.color],
              )}
            >
              <AppIcon name={item.icon} className="size-5" />
            </div>
            <span className="flex-1 text-[13.5px] text-app-fg">
              {item.label}
            </span>
            <span className="text-[18px] font-extrabold text-app-fg">
              {item.value}
            </span>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}
