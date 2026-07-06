"use client";

import { useState } from "react";

import { toast } from "sonner";

import { AppIcon } from "@/components/app/app-icon";
import { StatusBadge } from "@/components/app/status-badge";

import { useManagerRequestsQuery } from "@/queries/requests";

import { cn } from "@/lib/utils";

import type { ManagerRequest } from "@/types/requests.type";

type QueueTab = "open" | "progress" | "done" | "all";

const TABS: { k: QueueTab; label: string }[] = [
  { k: "open", label: "باز" },
  { k: "progress", label: "در جریان" },
  { k: "done", label: "انجام‌شده" },
  { k: "all", label: "همه" },
];

function filterRequests(
  requests: ManagerRequest[],
  tab: QueueTab,
): ManagerRequest[] {
  if (tab === "open") return requests.filter((r) => r.status === "باز");
  if (tab === "progress")
    return requests.filter(
      (r) => r.status === "در حال انجام" || r.status === "ارجاع‌شده",
    );
  if (tab === "done") return requests.filter((r) => r.status === "انجام‌شده");
  return requests;
}

export default function QueuePage() {
  const [tab, setTab] = useState<QueueTab>("open");
  const { data: requests = [] } = useManagerRequestsQuery();

  const rows = filterRequests(requests, tab);

  const handleAssign = (id: string) => {
    toast.success(`درخواست #${id} به کارکن ارجاع شد`);
  };

  return (
    <div className="sk-page">
      <div className="mb-[18px] flex w-fit gap-1.5 rounded-[11px] border border-app-border bg-app-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.k}
            type="button"
            onClick={() => setTab(t.k)}
            className={cn(
              "h-[34px] rounded-lg px-4 text-[13px] font-semibold transition-colors",
              tab === t.k
                ? "bg-app-gold text-app-gold-fg"
                : "bg-transparent text-app-muted hover:text-app-fg",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-[var(--ap-shadow-sm)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-[13.5px]">
            <thead>
              <tr className="text-right text-[12.5px] text-app-muted">
                <th className="px-[18px] py-[13px] font-medium">#</th>
                <th className="px-[18px] py-[13px] font-medium">موضوع</th>
                <th className="px-[18px] py-[13px] font-medium">واحد</th>
                <th className="px-[18px] py-[13px] font-medium">اولویت</th>
                <th className="px-[18px] py-[13px] font-medium">وضعیت</th>
                <th className="px-[18px] py-[13px] font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-app-border hover:bg-app-surface2"
                >
                  <td className="px-[18px] py-[13px] text-app-muted">{r.id}</td>
                  <td className="px-[18px] py-[13px]">
                    <div className="font-semibold text-app-fg">{r.title}</div>
                    <div className="text-[11.5px] text-app-muted">{r.type}</div>
                  </td>
                  <td className="px-[18px] py-[13px] text-app-fg">{r.unit}</td>
                  <td className="px-[18px] py-[13px]">
                    <StatusBadge color={r.priorityColor}>
                      {r.priority}
                    </StatusBadge>
                  </td>
                  <td className="px-[18px] py-[13px]">
                    <StatusBadge color={r.statusColor}>{r.status}</StatusBadge>
                  </td>
                  <td className="px-[18px] py-[13px]">
                    <button
                      type="button"
                      onClick={() => handleAssign(r.id)}
                      className="flex h-8 items-center gap-1.5 rounded-lg border border-app-border bg-transparent px-3 text-[12.5px] font-semibold text-app-gold transition-colors hover:border-app-gold"
                    >
                      <AppIcon name="person_add" className="size-4" />
                      ارجاع
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-app-border px-[18px] py-[14px] text-[13px] text-app-muted">
          <span>نمایش ۱ تا ۶ از ۱۸ درخواست</span>
          <div className="flex gap-1.5">
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-lg border border-app-border bg-transparent text-app-fg"
            >
              <AppIcon name="chevron_right" className="size-4" />
            </button>
            <button
              type="button"
              className="size-8 rounded-lg bg-app-gold font-bold text-app-gold-fg"
            >
              ۱
            </button>
            <button
              type="button"
              className="size-8 rounded-lg border border-app-border bg-transparent text-app-fg"
            >
              ۲
            </button>
            <button
              type="button"
              className="size-8 rounded-lg border border-app-border bg-transparent text-app-fg"
            >
              ۳
            </button>
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-lg border border-app-border bg-transparent text-app-fg"
            >
              <AppIcon name="chevron_left" className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
