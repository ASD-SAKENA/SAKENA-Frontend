"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { AppField, AppInput, AppSelect } from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";

import {
  useCreateFacilityMutation,
  useDeleteFacilityMutation,
  useFacilitiesQuery,
  useUpdateFacilityMutation,
} from "@/queries/reserve";

import {
  FACILITY_ICONS,
  type FacilityForm,
  facilitySchema,
} from "@/schemas/facility.schema";

import type { Facility } from "@/types/reserve.type";

interface Props {
  open: boolean;
  onClose: () => void;
}

const EMPTY: FacilityForm = { name: "", icon: "fitness_center" };

export function FacilityManageModal({ open, onClose }: Props) {
  const { data: facilities = [] } = useFacilitiesQuery();
  const createFacility = useCreateFacilityMutation();
  const updateFacility = useUpdateFacilityMutation();
  const deleteFacility = useDeleteFacilityMutation();
  const [editing, setEditing] = useState<Facility | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Facility | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FacilityForm>({
    resolver: zodResolver(facilitySchema),
    defaultValues: EMPTY,
    values: editing ? { name: editing.label, icon: editing.icon } : EMPTY,
  });

  const pending =
    createFacility.isPending ||
    updateFacility.isPending ||
    deleteFacility.isPending;

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (editing) {
        await updateFacility.mutateAsync({
          id: editing.id,
          payload: { ...values, capacity: editing.capacity },
        });
        toast.success("امکان ویرایش شد");
      } else {
        await createFacility.mutateAsync(values);
        toast.success("امکان جدید به لیست مشاعات اضافه شد");
      }
      setEditing(null);
      reset(EMPTY);
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  });

  const handleDelete = async (facility: Facility) => {
    if (pendingDelete?.id !== facility.id) {
      setPendingDelete(facility);
      return;
    }
    try {
      await deleteFacility.mutateAsync(facility.id);
      toast.success(`«${facility.label}» حذف شد`);
      setPendingDelete(null);
      if (editing?.id === facility.id) setEditing(null);
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  };

  const handleClose = () => {
    setEditing(null);
    setPendingDelete(null);
    reset(EMPTY);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="مدیریت امکانات رزرو"
      description="امکانات این لیست در منوی رزرو ساکنین نمایش داده می‌شوند."
    >
      <div className="mt-4 mb-5 flex flex-col gap-2">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="flex items-center gap-3 rounded-xl border border-app-border bg-app-surface2 px-3.5 py-2.5"
          >
            <AppIcon name={facility.icon} className="size-5 text-app-steel" />
            <span className="flex-1 text-[13.5px] font-semibold text-app-fg">
              {facility.label}
            </span>
            <button
              type="button"
              onClick={() => setEditing(facility)}
              className="text-[12.5px] font-semibold text-app-gold"
            >
              ویرایش
            </button>
            <button
              type="button"
              onClick={() => handleDelete(facility)}
              className="text-[12.5px] font-semibold text-app-danger"
            >
              {pendingDelete?.id === facility.id ? "مطمئنید؟" : "حذف"}
            </button>
          </div>
        ))}
        {facilities.length === 0 ? (
          <p className="text-[13px] text-app-muted">
            هنوز امکانی ثبت نشده است.
          </p>
        ) : null}
      </div>

      <form onSubmit={onSubmit}>
        <AppField
          label={editing ? `ویرایش «${editing.label}»` : "افزودن امکان جدید"}
          error={errors.name?.message}
        >
          <AppInput placeholder="مثلاً سالن ورزش" {...register("name")} />
        </AppField>

        <AppField label="آیکون" error={errors.icon?.message}>
          <AppSelect {...register("icon")}>
            {FACILITY_ICONS.map((icon) => (
              <option key={icon.value} value={icon.value}>
                {icon.label}
              </option>
            ))}
          </AppSelect>
        </AppField>

        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="submit"
            disabled={pending}
            className="h-[46px] flex-1"
          >
            {editing ? "ذخیره تغییرات" : "افزودن امکان"}
          </AppButton>
          {editing ? (
            <AppButton
              type="button"
              variant="outline"
              onClick={() => {
                setEditing(null);
                reset(EMPTY);
              }}
              className="h-[46px] px-6"
            >
              انصراف از ویرایش
            </AppButton>
          ) : null}
        </div>
      </form>
    </Modal>
  );
}
