"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppInput, AppSelect } from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";

import {
  useCreateApartmentMutation,
  useUpdateApartmentMutation,
} from "@/queries/units";

import {
  type ApartmentForm,
  type ApartmentFormInput,
  apartmentSchema,
} from "@/schemas/units.schema";

import type { BuildingApiResponse } from "@/types/units.api.type";
import type { Unit } from "@/types/units.type";

interface Props {
  open: boolean;
  onClose: () => void;
  buildings: BuildingApiResponse[];
  /** When set, the modal edits this unit instead of creating one. */
  unit?: Unit | null;
  /** Pre-selected building for the create flow. */
  defaultBuildingId?: string;
}

export function ApartmentModal({
  open,
  onClose,
  buildings,
  unit,
  defaultBuildingId,
}: Props) {
  const createApartment = useCreateApartmentMutation();
  const updateApartment = useUpdateApartmentMutation();
  const isEdit = Boolean(unit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApartmentFormInput, unknown, ApartmentForm>({
    resolver: zodResolver(apartmentSchema),
    defaultValues: {
      buildingId: defaultBuildingId ?? "",
      unitNumber: "",
      floorNumber: 0,
      areaSquareMeters: 0,
      bedrooms: 0,
    },
    values: unit
      ? {
          buildingId: unit.buildingId,
          unitNumber: unit.raw.unitNumber,
          floorNumber: unit.raw.floorNumber,
          areaSquareMeters: unit.raw.areaSquareMeters,
          bedrooms: unit.raw.bedrooms,
        }
      : undefined,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (unit) {
        await updateApartment.mutateAsync({ id: unit.id, payload: values });
        toast.success("واحد ویرایش شد");
      } else {
        await createApartment.mutateAsync(values);
        toast.success("واحد جدید ثبت شد");
      }
      reset();
      onClose();
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "ویرایش واحد" : "افزودن واحد"}
      icon="door_front"
    >
      <form onSubmit={onSubmit} className="mt-4">
        <AppField label="ساختمان" error={errors.buildingId?.message}>
          <AppSelect {...register("buildingId")}>
            <option value="">انتخاب کنید…</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </AppSelect>
        </AppField>

        <div className="grid grid-cols-2 gap-3">
          <AppField label="شماره واحد" error={errors.unitNumber?.message}>
            <AppInput placeholder="مثلاً ۱۲" {...register("unitNumber")} />
          </AppField>
          <AppField label="طبقه" error={errors.floorNumber?.message}>
            <AppInput
              type="number"
              dir="ltr"
              min={0}
              {...register("floorNumber")}
            />
          </AppField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <AppField
            label="متراژ (متر مربع)"
            error={errors.areaSquareMeters?.message}
          >
            <AppInput
              type="number"
              dir="ltr"
              min={1}
              step="0.01"
              {...register("areaSquareMeters")}
            />
          </AppField>
          <AppField label="تعداد خواب" error={errors.bedrooms?.message}>
            <AppInput
              type="number"
              dir="ltr"
              min={0}
              max={20}
              {...register("bedrooms")}
            />
          </AppField>
        </div>

        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="submit"
            disabled={createApartment.isPending || updateApartment.isPending}
            className="h-[46px] flex-1"
          >
            {isEdit ? "ذخیره تغییرات" : "ثبت واحد"}
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
