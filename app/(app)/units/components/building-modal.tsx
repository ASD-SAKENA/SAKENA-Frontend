"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import {
  AppField,
  AppInput,
  AppTextarea,
} from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";

import { useUpdateBuildingMutation } from "@/queries/units";

import { type BuildingForm, buildingSchema } from "@/schemas/units.schema";

import type { BuildingApiResponse } from "@/types/units.api.type";

interface Props {
  open: boolean;
  onClose: () => void;
  /** The building the signed-in manager administers. */
  building: BuildingApiResponse;
}

export function BuildingModal({ open, onClose, building }: Props) {
  const updateBuilding = useUpdateBuildingMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuildingForm>({
    resolver: zodResolver(buildingSchema),
    values: { name: building.name, address: building.address },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateBuilding.mutateAsync({ id: building.id, payload: values });
      toast.success("ساختمان ویرایش شد");
      onClose();
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="ویرایش ساختمان"
      icon="apartment"
    >
      <form onSubmit={onSubmit} className="mt-4">
        <AppField label="نام ساختمان" error={errors.name?.message}>
          <AppInput placeholder="مثلاً برج نیلوفر" {...register("name")} />
        </AppField>

        <AppField label="آدرس" error={errors.address?.message}>
          <AppTextarea
            placeholder="آدرس کامل ساختمان…"
            {...register("address")}
          />
        </AppField>

        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="submit"
            disabled={updateBuilding.isPending}
            className="h-[46px] flex-1"
          >
            ذخیره تغییرات
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
