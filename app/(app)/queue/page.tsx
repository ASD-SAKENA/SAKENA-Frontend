"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { AppField, AppInput } from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";
import { StatusBadge } from "@/components/app/status-badge";

import {
  useApproveRequestMutation,
  useAssignRequestMutation,
  useManagerRequestsQuery,
} from "@/queries/requests";
import { useSettleRequestMutation } from "@/queries/wallet";

import { toFaDigits } from "@/lib/persian-number";
import { cn } from "@/lib/utils";

import {
  type AssignWorkerForm,
  assignWorkerSchema,
} from "@/schemas/request.schema";

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
  if (tab === "open")
    return requests.filter(
      (r) => r.status === "باز" || r.status === "تأییدشده",
    );
  if (tab === "progress")
    return requests.filter(
      (r) => r.status === "در حال انجام" || r.status === "ارجاع‌شده",
    );
  if (tab === "done")
    return requests.filter(
      (r) => r.status === "انجام‌شده" || r.status === "تسویه‌شده",
    );
  return requests;
}

export default function QueuePage() {
  const [tab, setTab] = useState<QueueTab>("open");
  const [assignTarget, setAssignTarget] = useState<ManagerRequest | null>(null);
  const { data: requests = [] } = useManagerRequestsQuery();
  const approve = useApproveRequestMutation();
  const assign = useAssignRequestMutation();
  const settle = useSettleRequestMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignWorkerForm>({
    resolver: zodResolver(assignWorkerSchema),
    defaultValues: { workerId: "" },
  });

  const rows = filterRequests(requests, tab);

  const handleApprove = (r: ManagerRequest) => {
    approve.mutate(r.id, {
      onSuccess: () => {
        toast.success(`درخواست «${r.title}» تأیید شد`);
      },
    });
  };

  const handleSettle = (r: ManagerRequest) => {
    settle.mutate(r.id, {
      onSuccess: () => {
        toast.success(`دستمزد «${r.title}» تسویه و به کیف پول کارکن واریز شد`);
      },
    });
  };

  const onAssignSubmit = handleSubmit(async (values) => {
    if (!assignTarget) return;
    try {
      await assign.mutateAsync({
        id: assignTarget.id,
        workerId: values.workerId,
      });
      toast.success(`درخواست «${assignTarget.title}» به کارکن ارجاع شد`);
      reset();
      setAssignTarget(null);
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  });

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
                <th className="px-[18px] py-[13px] font-medium">محل</th>
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
                  <td className="px-[18px] py-[13px] text-app-muted">
                    {r.displayId}
                  </td>
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
                    {r.apiStatus === "PENDING" ? (
                      <button
                        type="button"
                        onClick={() => handleApprove(r)}
                        disabled={approve.isPending}
                        className="flex h-8 items-center gap-1.5 rounded-lg border border-app-border bg-transparent px-3 text-[12.5px] font-semibold text-app-success transition-colors hover:border-app-success disabled:opacity-50"
                      >
                        <AppIcon name="check" className="size-4" />
                        تأیید
                      </button>
                    ) : r.apiStatus === "APPROVED" ||
                      r.apiStatus === "ASSIGNED" ? (
                      <button
                        type="button"
                        onClick={() => setAssignTarget(r)}
                        className="flex h-8 items-center gap-1.5 rounded-lg border border-app-border bg-transparent px-3 text-[12.5px] font-semibold text-app-gold transition-colors hover:border-app-gold"
                      >
                        <AppIcon name="person_add" className="size-4" />
                        ارجاع
                      </button>
                    ) : r.apiStatus === "COMPLETED" ? (
                      <button
                        type="button"
                        onClick={() => handleSettle(r)}
                        disabled={settle.isPending}
                        className="flex h-8 items-center gap-1.5 rounded-lg border border-app-border bg-transparent px-3 text-[12.5px] font-semibold text-app-gold transition-colors hover:border-app-gold disabled:opacity-50"
                      >
                        <AppIcon name="payments" className="size-4" />
                        پرداخت دستمزد
                      </button>
                    ) : (
                      <span className="text-[12px] text-app-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-app-border px-[18px] py-[14px] text-[13px] text-app-muted">
          نمایش {toFaDigits(rows.length)} درخواست
        </div>
      </div>

      <Modal
        open={assignTarget !== null}
        onClose={() => setAssignTarget(null)}
        title="ارجاع به کارکن"
        description="شناسه (UUID) کارکن را وارد کنید — فهرست کارکنان هنوز در بک‌اند موجود نیست."
      >
        <form onSubmit={onAssignSubmit} className="mt-4">
          <AppField label="شناسه کارکن" error={errors.workerId?.message}>
            <AppInput
              dir="ltr"
              placeholder="00000000-0000-0000-0000-000000000000"
              {...register("workerId")}
            />
          </AppField>
          <div className="mt-2 flex gap-2.5">
            <AppButton
              type="submit"
              disabled={assign.isPending}
              className="h-[46px] flex-1"
            >
              ارجاع درخواست
            </AppButton>
            <AppButton
              type="button"
              variant="outline"
              onClick={() => setAssignTarget(null)}
              className="h-[46px] px-6"
            >
              انصراف
            </AppButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
