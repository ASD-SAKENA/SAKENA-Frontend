"use client";

import { useState } from "react";

import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { AppSelect } from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";
import { StatusBadge } from "@/components/app/status-badge";

import {
  useBuildingResidenciesQuery,
  useEndResidencyMutation,
} from "@/queries/residency";
import {
  useBuildingsQuery,
  useDeleteApartmentMutation,
  useUnitsQuery,
} from "@/queries/units";

import { TENANCY_LABELS } from "@/schemas/residency.schema";

import type { StatusColor } from "@/types/app.type";
import type { Unit } from "@/types/units.type";

import { ApartmentModal } from "./components/apartment-modal";
import { BuildingModal } from "./components/building-modal";
import { InvitationList } from "./components/invitation-list";

const BALANCE_COLOR: Record<StatusColor, string> = {
  gold: "text-app-gold",
  success: "text-app-success",
  warning: "text-app-warning",
  danger: "text-app-danger",
  info: "text-app-info",
  steel: "text-app-steel",
  muted: "text-app-muted",
};

export default function UnitsPage() {
  const [apartmentModalOpen, setApartmentModalOpen] = useState(false);
  const [buildingModalOpen, setBuildingModalOpen] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState<
    string | null | undefined
  >(undefined);
  const [editUnit, setEditUnit] = useState<Unit | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const { data: buildings = [] } = useBuildingsQuery();
  const canViewAllBuildings = buildings.length > 1;
  const fallbackBuildingId = canViewAllBuildings
    ? null
    : (buildings[0]?.id ?? undefined);
  const selectedBuilding = buildings.find(
    (candidate) => candidate.id === selectedBuildingId,
  );
  const buildingId =
    selectedBuildingId === undefined
      ? fallbackBuildingId
      : selectedBuildingId === null
        ? canViewAllBuildings
          ? null
          : fallbackBuildingId
        : (selectedBuilding?.id ?? fallbackBuildingId);
  const building =
    buildingId === null
      ? null
      : (buildings.find((candidate) => candidate.id === buildingId) ?? null);
  const { data: units = [] } = useUnitsQuery(buildingId);
  const deleteApartment = useDeleteApartmentMutation();
  const { data: residencies = [] } = useBuildingResidenciesQuery(buildingId);
  const endResidency = useEndResidencyMutation();

  const residenciesByApartmentId = new Map(
    residencies.map((residency) => [residency.apartmentId, residency]),
  );

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteApartment.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`«${deleteTarget.label}» حذف شد`);
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div className="sk-page flex flex-col gap-4">
      <InvitationList buildingId={building?.id ?? null} />

      <div className="overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-[var(--ap-shadow-sm)]">
        <div className="flex items-center justify-between border-b border-app-border px-[18px] py-4">
          <div className="flex items-center gap-2.5">
            <div>
              <div className="text-[15px] font-bold text-app-fg">
                واحدها و ساکنین
              </div>
              {canViewAllBuildings ? (
                <AppSelect
                  aria-label="انتخاب ساختمان"
                  value={buildingId ?? "all"}
                  onChange={(event) =>
                    setSelectedBuildingId(
                      event.target.value === "all" ? null : event.target.value,
                    )
                  }
                  className="mt-0.5 h-8 min-w-40 text-[12.5px]"
                >
                  <option value="all">همه ساختمان‌ها</option>
                  {buildings.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </option>
                  ))}
                </AppSelect>
              ) : building ? (
                <div className="mt-0.5 text-[12.5px] text-app-muted">
                  {building.name}
                </div>
              ) : null}
            </div>
            {building ? (
              <button
                type="button"
                onClick={() => setBuildingModalOpen(true)}
                className="flex size-8 items-center justify-center rounded-lg border border-app-border text-app-muted transition-colors hover:border-app-gold hover:text-app-gold"
                aria-label="ویرایش ساختمان"
              >
                <AppIcon name="edit" className="size-4" />
              </button>
            ) : null}
          </div>
          <AppButton
            variant="gold"
            onClick={() => {
              setEditUnit(null);
              setApartmentModalOpen(true);
            }}
            className="h-[38px] gap-1.5 rounded-[10px] px-3.5 text-[13px]"
          >
            <AppIcon name="add" className="size-[18px]" />
            افزودن واحد
          </AppButton>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-[13.5px]">
            <thead>
              <tr className="text-right text-[12.5px] text-app-muted">
                <th className="px-[18px] py-[13px] font-medium">واحد</th>
                <th className="px-[18px] py-[13px] font-medium">ساکن</th>
                <th className="px-[18px] py-[13px] font-medium">وضعیت سکونت</th>
                <th className="px-[18px] py-[13px] font-medium">مانده شارژ</th>
                <th className="px-[18px] py-[13px] font-medium">وضعیت</th>
                <th className="px-[18px] py-[13px] font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => {
                const residency = residenciesByApartmentId.get(u.id);
                return (
                  <tr
                    key={u.id}
                    className="border-t border-app-border hover:bg-app-surface2"
                  >
                    <td className="px-[18px] py-[13px] font-bold text-app-fg">
                      {u.no}
                    </td>
                    <td className="px-[18px] py-[13px] text-app-fg">
                      {residency?.residentName ?? (
                        <span className="text-app-muted">خالی</span>
                      )}
                    </td>
                    <td className="px-[18px] py-[13px] text-app-muted">
                      {residency
                        ? `${TENANCY_LABELS[residency.tenancy]} · ${u.tenancy}`
                        : u.tenancy}
                    </td>
                    <td
                      className={`px-[18px] py-[13px] font-semibold ${BALANCE_COLOR[u.balanceColor]}`}
                    >
                      {u.balance}
                    </td>
                    <td className="px-[18px] py-[13px]">
                      <StatusBadge color={u.statusColor}>
                        {u.status}
                      </StatusBadge>
                    </td>
                    <td className="px-[18px] py-[13px]">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditUnit(u);
                            setApartmentModalOpen(true);
                          }}
                          className="flex size-8 items-center justify-center rounded-lg border border-app-border text-app-muted transition-colors hover:border-app-gold hover:text-app-gold"
                          aria-label="ویرایش واحد"
                        >
                          <AppIcon name="edit" className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              id: u.id,
                              label: `واحد ${u.no}`,
                            })
                          }
                          className="flex size-8 items-center justify-center rounded-lg border border-app-border text-app-muted transition-colors hover:border-app-danger hover:text-app-danger"
                          aria-label="حذف واحد"
                        >
                          <AppIcon name="delete" className="size-4" />
                        </button>
                        {residency ? (
                          <button
                            type="button"
                            onClick={() =>
                              endResidency.mutate(u.id, {
                                onSuccess: () =>
                                  toast.success(`واحد ${u.no} خالی شد`),
                              })
                            }
                            disabled={endResidency.isPending}
                            className="h-8 rounded-lg border border-app-border px-2.5 text-[12px] font-semibold text-app-muted transition-colors hover:border-app-danger hover:text-app-danger disabled:opacity-50"
                          >
                            تخلیه
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ApartmentModal
        open={apartmentModalOpen}
        onClose={() => {
          setApartmentModalOpen(false);
          setEditUnit(null);
        }}
        buildings={buildings}
        unit={editUnit}
        defaultBuildingId={building?.id}
      />

      {building ? (
        <BuildingModal
          open={buildingModalOpen}
          onClose={() => setBuildingModalOpen(false)}
          building={building}
        />
      ) : null}

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="حذف"
        description={
          deleteTarget
            ? `آیا از حذف «${deleteTarget.label}» مطمئن هستید؟ این عمل قابل بازگشت نیست.`
            : undefined
        }
        icon="delete"
      >
        <div className="mt-4 flex gap-2.5">
          <AppButton
            onClick={handleDelete}
            disabled={deleteApartment.isPending}
            className="h-[46px] flex-1 bg-app-danger text-white hover:brightness-105"
          >
            حذف
          </AppButton>
          <AppButton
            variant="outline"
            onClick={() => setDeleteTarget(null)}
            className="h-[46px] px-6"
          >
            انصراف
          </AppButton>
        </div>
      </Modal>
    </div>
  );
}
