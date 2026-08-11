"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppSelect } from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";

import { useStartResidencyMutation } from "@/queries/residency";
import { useUsersQuery } from "@/queries/users";

import {
  type ResidencyForm,
  residencySchema,
  TENANCY_LABELS,
} from "@/schemas/residency.schema";

import type { Unit } from "@/types/units.type";

interface Props {
  unit: Unit | null;
  onClose: () => void;
}

export function ResidencyModal({ unit, onClose }: Props) {
  const { data: residents = [] } = useUsersQuery("RESIDENT");
  const startResidency = useStartResidencyMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResidencyForm>({
    resolver: zodResolver(residencySchema),
    defaultValues: { residentId: "", tenancy: "OWNER_OCCUPIER" },
  });

  // A deactivated account should not be moved into a unit.
  const assignable = residents.filter((resident) => resident.active);

  const onSubmit = handleSubmit(async (values) => {
    if (!unit) return;
    try {
      await startResidency.mutateAsync({
        apartmentId: unit.id,
        payload: values,
      });
      toast.success(`ساکن واحد ${unit.no} ثبت شد`);
      reset();
      onClose();
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  });

  return (
    <Modal
      open={unit !== null}
      onClose={onClose}
      title={unit ? `تخصیص ساکن به واحد ${unit.no}` : "تخصیص ساکن"}
      description="هر واحد یک ساکن فعلی دارد و هر ساکن تنها در یک واحد ثبت می‌شود."
    >
      <form onSubmit={onSubmit} className="mt-4">
        <AppField label="ساکن" error={errors.residentId?.message}>
          <AppSelect {...register("residentId")}>
            <option value="">انتخاب کنید…</option>
            {assignable.map((resident) => (
              <option key={resident.id} value={resident.id}>
                {resident.username}
              </option>
            ))}
          </AppSelect>
        </AppField>

        <AppField label="وضعیت سکونت" error={errors.tenancy?.message}>
          <AppSelect {...register("tenancy")}>
            {Object.entries(TENANCY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </AppSelect>
        </AppField>

        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="submit"
            disabled={startResidency.isPending}
            className="h-[46px] flex-1"
          >
            ثبت ساکن
          </AppButton>
          <AppButton
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-[46px] px-6"
          >
            انصراف
          </AppButton>
        </div>
      </form>
    </Modal>
  );
}
