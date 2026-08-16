"use client";

import { useState } from "react";

import { AppIcon } from "@/components/app/app-icon";
import { StatusBadge } from "@/components/app/status-badge";

import { useAppUiStore } from "@/stores/app-ui.store";

import { faNumber } from "@/lib/persian-number";

import type { ServiceRequest } from "@/types/requests.type";

interface Props {
  request: ServiceRequest;
}

const REPORT_STATUSES = new Set(["COMPLETED", "SETTLED"]);

export function RequestCard({ request }: Props) {
  const openRequestModal = useAppUiStore((s) => s.openRequestModal);
  const [reportOpen, setReportOpen] = useState(false);

  const editable = request.apiStatus === "PENDING";
  const hasReport = REPORT_STATUSES.has(request.apiStatus);

  return (
    <div className="rounded-2xl border border-app-border bg-app-surface p-[18px] shadow-[var(--ap-shadow-sm)]">
      <div className="flex items-center gap-4">
        <div className="flex size-[46px] flex-shrink-0 items-center justify-center rounded-xl bg-app-surface2">
          <AppIcon name={request.icon} className="size-[23px] text-app-steel" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-[5px] flex items-center gap-2.5">
            <span className="text-[14.5px] font-bold">{request.title}</span>
            <span className="text-[11.5px] text-app-muted">
              #{request.displayId}
            </span>
          </div>
          <div className="text-[13px] text-app-muted">
            {request.description}
          </div>
        </div>
        <div className="flex flex-shrink-0 flex-col items-end gap-2">
          <StatusBadge color={request.statusColor}>
            {request.status}
          </StatusBadge>
          <div className="text-[12px] text-app-muted">{request.date}</div>
        </div>
      </div>

      {editable || hasReport ? (
        <div className="mt-3 flex gap-2 border-t border-app-border pt-3">
          {editable ? (
            <button
              type="button"
              onClick={() => openRequestModal(request)}
              className="flex items-center gap-1 text-[12.5px] font-semibold text-app-gold hover:brightness-110"
            >
              <AppIcon name="edit" className="size-[15px]" />
              ویرایش درخواست
            </button>
          ) : null}
          {hasReport ? (
            <button
              type="button"
              onClick={() => setReportOpen((v) => !v)}
              className="flex items-center gap-1 text-[12.5px] font-semibold text-app-info hover:brightness-110"
            >
              <AppIcon name="description" className="size-[15px]" />
              گزارش انجام کار
            </button>
          ) : null}
        </div>
      ) : null}

      {hasReport && reportOpen ? (
        <div className="mt-3 rounded-xl border border-app-border bg-app-surface2 p-3.5 text-[13px] leading-7 text-app-fg">
          <p>{request.completionReport ?? "گزارشی ثبت نشده است."}</p>
          {request.completionCost !== null ? (
            <p className="mt-1.5 font-semibold text-app-gold">
              هزینه: {faNumber(request.completionCost)} تومان
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
