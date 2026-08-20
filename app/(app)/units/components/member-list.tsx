"use client";

import { useState } from "react";

import { AppIcon } from "@/components/app/app-icon";
import { StatusBadge } from "@/components/app/status-badge";

import { useBuildingMembersQuery } from "@/queries/invitations";

import { TENANCY_LABELS } from "@/schemas/residency.schema";

import type { BuildingMemberApiResponse } from "@/types/invitations.api.type";

import { AssignUnitModal } from "./assign-unit-modal";

interface Props {
  buildingId: string | null;
}

/**
 * Everyone who joined the building. Someone invited without a unit lands here
 * with nothing assigned, and this is where the manager places them — otherwise
 * a unit-less invitation would leave them stranded with no way to be found.
 */
export function MemberList({ buildingId }: Props) {
  const [assignTarget, setAssignTarget] =
    useState<BuildingMemberApiResponse | null>(null);
  const { data: members = [] } = useBuildingMembersQuery(buildingId);

  if (buildingId === null || members.length === 0) return null;

  const unassigned = members.filter((m) => m.unitNumber === null).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-[var(--ap-shadow-sm)]">
      <div className="flex items-center justify-between border-b border-app-border px-[18px] py-[14px]">
        <h2 className="text-[14.5px] font-bold text-app-fg">ساکنین ساختمان</h2>
        {unassigned > 0 ? (
          <span className="text-[12px] text-app-warning">
            {unassigned} نفر بدون واحد
          </span>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-[13.5px]">
          <thead>
            <tr className="text-right text-[12.5px] text-app-muted">
              <th className="px-[18px] py-[13px] font-medium">نام</th>
              <th className="px-[18px] py-[13px] font-medium">ایمیل</th>
              <th className="px-[18px] py-[13px] font-medium">واحد</th>
              <th className="px-[18px] py-[13px] font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member.userId}
                className="border-t border-app-border hover:bg-app-surface2"
              >
                <td className="px-[18px] py-[13px] font-semibold text-app-fg">
                  {member.username}
                </td>
                <td dir="ltr" className="px-[18px] py-[13px] text-app-muted">
                  {member.email}
                </td>
                <td className="px-[18px] py-[13px]">
                  {member.unitNumber ? (
                    <StatusBadge color="success">
                      واحد {member.unitNumber}
                      {member.tenancy
                        ? ` — ${TENANCY_LABELS[member.tenancy]}`
                        : ""}
                    </StatusBadge>
                  ) : (
                    <StatusBadge color="warning">بدون واحد</StatusBadge>
                  )}
                </td>
                <td className="px-[18px] py-[13px]">
                  {member.unitNumber === null ? (
                    <button
                      type="button"
                      onClick={() => setAssignTarget(member)}
                      className="flex h-8 items-center gap-1.5 rounded-lg border border-app-border bg-transparent px-3 text-[12.5px] font-semibold text-app-gold transition-colors hover:border-app-gold"
                    >
                      <AppIcon name="apartment" className="size-4" />
                      اختصاص واحد
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

      <AssignUnitModal
        member={assignTarget}
        buildingId={buildingId}
        onClose={() => setAssignTarget(null)}
      />
    </div>
  );
}
