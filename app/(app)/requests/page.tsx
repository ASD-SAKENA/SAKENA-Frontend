"use client";

import { useState } from "react";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";

import { useResidentRequestsQuery } from "@/queries/requests";

import { useAppUiStore } from "@/stores/app-ui.store";

import { cn } from "@/lib/utils";

import { RequestCard } from "./components/request-card";

type RequestTab = "all" | "open" | "done";

const TABS: { key: RequestTab; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "open", label: "باز" },
  { key: "done", label: "انجام‌شده" },
];

export default function RequestsPage() {
  const [tab, setTab] = useState<RequestTab>("all");
  const openRequestModal = useAppUiStore((s) => s.openRequestModal);
  const { data: requests = [] } = useResidentRequestsQuery();

  const filtered = requests.filter((r) => {
    if (tab === "open") return r.status !== "انجام‌شده";
    if (tab === "done") return r.status === "انجام‌شده";
    return true;
  });

  return (
    <div className="sk-page">
      <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 rounded-xl border border-app-border bg-app-surface p-1">
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
        <AppButton variant="gold" onClick={openRequestModal}>
          <AppIcon name="add" className="size-[19px]" />
          ثبت درخواست
        </AppButton>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
}
