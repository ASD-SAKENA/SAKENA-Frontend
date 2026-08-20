"use client";

import { useState } from "react";

import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppSelect } from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";

import { useBuildingResidenciesQuery } from "@/queries/residency";
import { useStartResidencyMutation } from "@/queries/residency";
import { useUnitsQuery } from "@/queries/units";

import { TENANCY_LABELS } from "@/schemas/residency.schema";

import type { BuildingMemberApiResponse } from "@/types/invitations.api.type";
import type { TenancyTypeApi } from "@/types/residency.api.type";

interface Props {
  member: BuildingMemberApiResponse | null;
  buildingId: string | null;
  onClose: () => void;
}

/** Places a member who joined the building into one of its vacant units. */
export function AssignUnitModal({ member, buildingId, onClose }: Props) {
  const [apartmentId, setApartmentId] = useState("");
  const [tenancy, setTenancy] = useState<TenancyTypeApi>("TENANT");
  const { data: units = [] } = useUnitsQuery(buildingId ?? undefined);
  const { data: residencies = [] } = useBuildingResidenciesQuery(buildingId);
  const startResidency = useStartResidencyMutation();

  const occupiedUnitIds = new Set(residencies.map((r) => r.apartmentId));
  const vacantUnits = units.filter((unit) => !occupiedUnitIds.has(unit.id));

  const handleClose = () => {
    setApartmentId("");
    setTenancy("TENANT");
    onClose();
  };

  const handleSubmit = async () => {
    if (!member || !apartmentId) return;
    try {
      await startResidency.mutateAsync({
        apartmentId,
        payload: { residentId: member.userId, tenancy },
      });
      toast.success(`واحد به ${member.username} اختصاص یافت`);
      handleClose();
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  };

  if (!member) return null;

  return (
    <Modal
      open
      onClose={handleClose}
      title="اختصاص واحد"
      description={`انتخاب واحد برای ${member.username} (${member.email}).`}
      icon="apartment"
    >
      <div className="mt-4">
        <AppField label="واحد">
          <AppSelect
            value={apartmentId}
            onChange={(e) => setApartmentId(e.target.value)}
          >
            <option value="">انتخاب واحد</option>
            {vacantUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                واحد {unit.no}
              </option>
            ))}
          </AppSelect>
        </AppField>

        <AppField label="وضعیت سکونت">
          <AppSelect
            value={tenancy}
            onChange={(e) => setTenancy(e.target.value as TenancyTypeApi)}
          >
            {Object.entries(TENANCY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </AppSelect>
        </AppField>

        {vacantUnits.length === 0 ? (
          <p className="mb-4 rounded-xl bg-app-surface2 px-3.5 py-2.5 text-[12.5px] leading-[1.9] text-app-muted">
            واحد خالی وجود ندارد. ابتدا سکونت فعلی یکی از واحدها را پایان دهید.
          </p>
        ) : null}

        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="button"
            onClick={handleSubmit}
            disabled={apartmentId === "" || startResidency.isPending}
            className="h-[46px] flex-1"
          >
            اختصاص واحد
          </AppButton>
          <AppButton
            type="button"
            variant="outline"
            onClick={handleClose}
            className="h-[46px] px-6"
          >
            انصراف
          </AppButton>
        </div>
      </div>
    </Modal>
  );
}
