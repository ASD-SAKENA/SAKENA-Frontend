"use client";

import { AppIcon } from "@/components/app/app-icon";
import { Modal } from "@/components/app/modal";
import { StatusBadge } from "@/components/app/status-badge";

import { REQUEST_STATUS_META } from "@/lib/service-requests";

import type { StaffTask } from "@/types/tasks.type";

interface Props {
  task: StaffTask | null;
  onClose: () => void;
}

export function TaskDetailModal({ task, onClose }: Props) {
  const status = task ? REQUEST_STATUS_META[task.apiStatus] : null;

  return (
    <Modal
      open={task !== null}
      onClose={onClose}
      title={task?.title ?? ""}
      description={task ? `${task.type} · واحد ${task.unit}` : undefined}
      icon={task?.icon}
    >
      {task && status ? (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <StatusBadge color={status.color}>{status.label}</StatusBadge>
          </div>

          <div>
            <div className="mb-1.5 text-[12.5px] font-semibold text-app-muted">
              شرح درخواست
            </div>
            <p className="rounded-xl border border-app-border bg-app-surface2 p-3.5 text-[13.5px] leading-7 text-app-fg">
              {task.description || "توضیحی ثبت نشده است."}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[13px] text-app-muted">
            <AppIcon name="event" className="size-[17px]" />
            تاریخ ارجاع: {task.date}
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
