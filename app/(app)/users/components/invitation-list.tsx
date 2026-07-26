"use client";

import { useState } from "react";

import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { AppSelect } from "@/components/app/form-controls";
import { SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";

import {
  useBuildingInvitationsQuery,
  useRevokeInvitationMutation,
} from "@/queries/invitations";
import { useBuildingsQuery } from "@/queries/units";

import { formatFaDate } from "@/lib/format-date";

import {
  INVITATION_CHANNEL_LABELS,
  INVITATION_STATUS_LABELS,
} from "@/schemas/invitation.schema";

import type { StatusColor } from "@/types/app.type";
import type { InvitationStatusApi } from "@/types/invitations.api.type";

import { InvitationModal } from "./invitation-modal";

const STATUS_COLORS: Record<InvitationStatusApi, StatusColor> = {
  PENDING: "warning",
  ACCEPTED: "success",
  REVOKED: "muted",
  EXPIRED: "danger",
};

/** Copying is best-effort: some browsers block the clipboard without a gesture. */
async function copyLink(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    toast.success("لینک دعوت کپی شد");
  } catch {
    toast("کپی نشد — لینک را دستی بردارید", { description: url });
  }
}

export function InvitationList() {
  const { data: buildings = [] } = useBuildingsQuery();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);

  const buildingId =
    buildings.find((b) => b.id === selectedId)?.id ?? buildings[0]?.id ?? null;
  const { data: invitations = [] } = useBuildingInvitationsQuery(buildingId);
  const revokeInvitation = useRevokeInvitationMutation();

  return (
    <SectionCard
      title="دعوت‌نامه‌ها"
      bodyClassName="p-0"
      action={
        <div className="flex items-center gap-2">
          {buildings.length > 1 ? (
            <AppSelect
              value={buildingId ?? ""}
              onChange={(event) => setSelectedId(event.target.value)}
              className="h-9 w-auto min-w-[160px] text-[13px]"
            >
              {buildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </AppSelect>
          ) : null}
          <AppButton
            variant="gold"
            onClick={() => setComposerOpen(true)}
            disabled={buildingId === null}
            className="h-9 gap-1.5 px-3.5 text-[13px]"
          >
            <AppIcon name="person_add" className="size-[18px]" />
            دعوت کاربر
          </AppButton>
        </div>
      }
    >
      {buildingId === null ? (
        <p className="px-[18px] py-6 text-[13px] text-app-muted">
          ابتدا یک ساختمان تعریف کنید تا بتوانید کاربران را دعوت کنید.
        </p>
      ) : invitations.length === 0 ? (
        <p className="px-[18px] py-6 text-[13px] text-app-muted">
          هنوز دعوت‌نامه‌ای برای این ساختمان ساخته نشده است.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-[13.5px]">
            <thead>
              <tr className="text-right text-[12.5px] text-app-muted">
                <th className="px-[18px] py-[13px] font-medium">گیرنده</th>
                <th className="px-[18px] py-[13px] font-medium">روش</th>
                <th className="px-[18px] py-[13px] font-medium">نقش</th>
                <th className="px-[18px] py-[13px] font-medium">اعتبار تا</th>
                <th className="px-[18px] py-[13px] font-medium">وضعیت</th>
                <th className="px-[18px] py-[13px] font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((invitation) => (
                <tr
                  key={invitation.id}
                  className="border-t border-app-border hover:bg-app-surface2"
                >
                  <td
                    dir={invitation.recipient ? "ltr" : "rtl"}
                    className="px-[18px] py-[13px] text-right font-semibold text-app-fg"
                  >
                    {invitation.recipient ?? "لینک عمومی"}
                  </td>
                  <td className="px-[18px] py-[13px] text-app-muted">
                    {INVITATION_CHANNEL_LABELS[invitation.channel]}
                  </td>
                  <td className="px-[18px] py-[13px] text-app-muted">
                    {invitation.role === "STAFF" ? "کارکن" : "ساکن"}
                  </td>
                  <td className="px-[18px] py-[13px] text-app-muted">
                    {formatFaDate(invitation.expiresAt)}
                  </td>
                  <td className="px-[18px] py-[13px]">
                    <StatusBadge color={STATUS_COLORS[invitation.status]}>
                      {INVITATION_STATUS_LABELS[invitation.status]}
                    </StatusBadge>
                  </td>
                  <td className="px-[18px] py-[13px]">
                    {invitation.status === "PENDING" ? (
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => copyLink(invitation.acceptUrl)}
                          className="h-8 rounded-lg border border-app-border px-2.5 text-[12px] font-semibold text-app-gold transition-colors hover:border-app-gold"
                        >
                          کپی لینک
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            revokeInvitation.mutate(invitation.id, {
                              onSuccess: () => toast.success("دعوت لغو شد"),
                            })
                          }
                          disabled={revokeInvitation.isPending}
                          className="h-8 rounded-lg border border-app-border px-2.5 text-[12px] font-semibold text-app-muted transition-colors hover:border-app-danger hover:text-app-danger disabled:opacity-50"
                        >
                          لغو
                        </button>
                      </div>
                    ) : (
                      <span className="text-[12px] text-app-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <InvitationModal
        open={composerOpen}
        buildingId={buildingId}
        onClose={() => setComposerOpen(false)}
        onCreated={copyLink}
      />
    </SectionCard>
  );
}
