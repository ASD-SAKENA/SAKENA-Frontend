"use client";

import { useState } from "react";

import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { AppSelect } from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";
import { StatusBadge } from "@/components/app/status-badge";

import {
  useBuildingsQuery,
  useDeleteApartmentMutation,
  useDeleteBuildingMutation,
  useUnitsQuery,
} from "@/queries/units";

import type { StatusColor } from "@/types/app.type";
import type { BuildingApiResponse } from "@/types/units.api.type";
import type { Unit } from "@/types/units.type";

import { ApartmentModal } from "./components/apartment-modal";
import { BuildingModal } from "./components/building-modal";

const BALANCE_COLOR: Record<StatusColor, string> = {
  gold: "text-app-gold",
  success: "text-app-success",
  warning: "text-app-warning",
  danger: "text-app-danger",
  info: "text-app-info",
  steel: "text-app-steel",
  muted: "text-app-muted",
};

type DeleteTarget =
  | { kind: "unit"; id: string; label: string }
  | { kind: "building"; id: string; label: string };

export default function UnitsPage() {
  const [buildingFilter, setBuildingFilter] = useState<string>("");
  const [apartmentModalOpen, setApartmentModalOpen] = useState(false);
  const [buildingModalOpen, setBuildingModalOpen] = useState(false);
  const [editUnit, setEditUnit] = useState<Unit | null>(null);
  const [editBuilding, setEditBuilding] = useState<BuildingApiResponse | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const { data: buildings = [] } = useBuildingsQuery();
  const { data: units = [] } = useUnitsQuery(buildingFilter || undefined);
  const deleteApartment = useDeleteApartmentMutation();
  const deleteBuilding = useDeleteBuildingMutation();

  const selectedBuilding =
    buildings.find((b) => b.id === buildingFilter) ?? null;

  const handleDelete = () => {
    if (!deleteTarget) return;
    const mutation =
      deleteTarget.kind === "unit" ? deleteApartment : deleteBuilding;
    mutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`«${deleteTarget.label}» حذف شد`);
        if (deleteTarget.kind === "building") setBuildingFilter("");
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div className="sk-page">
      <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <AppSelect
            value={buildingFilter}
            onChange={(e) => setBuildingFilter(e.target.value)}
            className="h-[38px] w-[220px] rounded-[10px] text-[13px]"
          >
            <option value="">همه ساختمان‌ها</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </AppSelect>
          {selectedBuilding ? (
            <>
              <AppButton
                variant="outline"
                onClick={() => {
                  setEditBuilding(selectedBuilding);
                  setBuildingModalOpen(true);
                }}
                className="h-[38px] gap-1.5 rounded-[10px] px-3 text-[13px]"
              >
                <AppIcon name="edit" className="size-4" />
                ویرایش
              </AppButton>
              <AppButton
                variant="outline"
                onClick={() =>
                  setDeleteTarget({
                    kind: "building",
                    id: selectedBuilding.id,
                    label: selectedBuilding.name,
                  })
                }
                className="h-[38px] gap-1.5 rounded-[10px] px-3 text-[13px] text-app-danger"
              >
                <AppIcon name="delete" className="size-4" />
                حذف
              </AppButton>
            </>
          ) : null}
        </div>

        <div className="flex gap-2.5">
          <AppButton
            variant="outline"
            onClick={() => {
              setEditBuilding(null);
              setBuildingModalOpen(true);
            }}
            className="h-[38px] gap-1.5 rounded-[10px] px-3.5 text-[13px]"
          >
            <AppIcon name="apartment" className="size-[18px]" />
            افزودن ساختمان
          </AppButton>
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
      </div>

      <div className="overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-[var(--ap-shadow-sm)]">
        <div className="flex items-center justify-between border-b border-app-border px-[18px] py-4">
          <div className="text-[15px] font-bold text-app-fg">
            واحدها و ساکنین
          </div>
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
              {units.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-app-border hover:bg-app-surface2"
                >
                  <td className="px-[18px] py-[13px] font-bold text-app-fg">
                    {u.no}
                  </td>
                  <td className="px-[18px] py-[13px] text-app-fg">
                    {u.resident}
                  </td>
                  <td className="px-[18px] py-[13px] text-app-muted">
                    {u.tenancy}
                  </td>
                  <td
                    className={`px-[18px] py-[13px] font-semibold ${BALANCE_COLOR[u.balanceColor]}`}
                  >
                    {u.balance}
                  </td>
                  <td className="px-[18px] py-[13px]">
                    <StatusBadge color={u.statusColor}>{u.status}</StatusBadge>
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
                            kind: "unit",
                            id: u.id,
                            label: `واحد ${u.no}`,
                          })
                        }
                        className="flex size-8 items-center justify-center rounded-lg border border-app-border text-app-muted transition-colors hover:border-app-danger hover:text-app-danger"
                        aria-label="حذف واحد"
                      >
                        <AppIcon name="delete" className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
        defaultBuildingId={buildingFilter || undefined}
      />

      <BuildingModal
        open={buildingModalOpen}
        onClose={() => {
          setBuildingModalOpen(false);
          setEditBuilding(null);
        }}
        building={editBuilding}
      />

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
            disabled={deleteApartment.isPending || deleteBuilding.isPending}
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
