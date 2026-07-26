"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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

import { formatToman, toFaDigits } from "@/lib/persian-number";
import { API_WEEK_DAYS, SLOT_MINUTES } from "@/lib/reserve-time";

import {
  FACILITY_ICONS,
  type FacilityForm,
  facilitySchema,
} from "@/schemas/facility.schema";

import type { BookingRulesApi } from "@/types/reserve.api.type";
import type { Facility } from "@/types/reserve.type";

import { FacilityRulesFields } from "./facility-rules-fields";

interface Props {
  open: boolean;
  onClose: () => void;
}

const EMPTY: FacilityForm = {
  name: "",
  icon: "fitness_center",
  capacity: "10",
  opensAtHour: "8",
  closesAtHour: "22",
  closedDays: [],
  minDurationMinutes: "30",
  maxDurationMinutes: "120",
  maxAdvanceDays: "30",
  maxPerResidentPerWeek: "0",
  hourlyPrice: "0",
};

function toFormValues(facility: Facility): FacilityForm {
  const { rules } = facility;
  return {
    name: facility.label,
    icon: facility.icon,
    capacity: String(facility.capacity),
    opensAtHour: String(rules.startHour),
    closesAtHour: String(rules.endHour),
    closedDays: rules.closedDays,
    minDurationMinutes: String(rules.minSlots * SLOT_MINUTES),
    maxDurationMinutes: String(rules.maxSlots * SLOT_MINUTES),
    maxAdvanceDays: String(rules.maxAdvanceDays),
    maxPerResidentPerWeek: String(rules.maxPerWeek),
    hourlyPrice: String(rules.hourlyPrice),
  };
}

function toRulesPayload(values: FacilityForm): BookingRulesApi {
  const pad = (hour: string) => `${String(Number(hour)).padStart(2, "0")}:00`;
  return {
    opensAt: pad(values.opensAtHour),
    // A midnight closing is stored as 23:59 — the backend needs closesAt > opensAt.
    closesAt:
      Number(values.closesAtHour) >= 24 ? "23:59" : pad(values.closesAtHour),
    closedDays: values.closedDays
      .map((day) => API_WEEK_DAYS[day])
      .filter((day) => day !== undefined),
    minDurationMinutes: Number(values.minDurationMinutes),
    maxDurationMinutes: Number(values.maxDurationMinutes),
    maxAdvanceDays: Number(values.maxAdvanceDays),
    maxPerResidentPerWeek: Number(values.maxPerResidentPerWeek),
    hourlyPrice: Number(values.hourlyPrice),
  };
}

export function FacilityManageModal({ open, onClose }: Props) {
  const { data: facilities = [] } = useFacilitiesQuery();
  const createFacility = useCreateFacilityMutation();
  const updateFacility = useUpdateFacilityMutation();
  const deleteFacility = useDeleteFacilityMutation();
  const [editing, setEditing] = useState<Facility | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Facility | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FacilityForm>({
    resolver: zodResolver(facilitySchema),
    defaultValues: EMPTY,
    values: editing ? toFormValues(editing) : EMPTY,
  });

  const closedDays = useWatch({ control, name: "closedDays" });

  const pending =
    createFacility.isPending ||
    updateFacility.isPending ||
    deleteFacility.isPending;

  const toggleClosedDay = (day: number) => {
    const next = closedDays.includes(day)
      ? closedDays.filter((d) => d !== day)
      : [...closedDays, day];
    setValue("closedDays", next, { shouldValidate: true });
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload = {
        name: values.name,
        icon: values.icon,
        capacity: Number(values.capacity),
        rules: toRulesPayload(values),
      };
      if (editing) {
        await updateFacility.mutateAsync({ id: editing.id, payload });
        toast.success("امکان ویرایش شد");
      } else {
        await createFacility.mutateAsync(payload);
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
      description="ساعت کاری، مدت مجاز، سقف رزرو و هزینه‌ی هر امکان اینجا تعیین می‌شود."
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
              <span className="mr-2 text-[11.5px] font-normal text-app-muted">
                ظرفیت {toFaDigits(facility.capacity)} نفر ·{" "}
                {toFaDigits(facility.rules.startHour)}–
                {toFaDigits(facility.rules.endHour)} ·{" "}
                {facility.rules.hourlyPrice > 0
                  ? `${formatToman(facility.rules.hourlyPrice)} در ساعت`
                  : "رایگان"}
              </span>
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

        <AppField label="ظرفیت هر سانس (نفر)" error={errors.capacity?.message}>
          <AppInput dir="ltr" placeholder="10" {...register("capacity")} />
        </AppField>

        <FacilityRulesFields
          register={register}
          errors={errors}
          closedDays={closedDays}
          onToggleClosedDay={toggleClosedDay}
        />

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
