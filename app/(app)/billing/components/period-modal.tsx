"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppInput, AppSelect } from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";

import { useCreateChargePeriodMutation } from "@/queries/billing";
import { useBuildingsQuery } from "@/queries/units";

import { PERIOD_TYPE_LABELS } from "@/lib/billing";

import {
  type ChargePeriodForm,
  chargePeriodSchema,
} from "@/schemas/billing.schema";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function PeriodModal({ open, onClose }: Props) {
  const { data: buildings = [] } = useBuildingsQuery();
  const createPeriod = useCreateChargePeriodMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChargePeriodForm>({
    resolver: zodResolver(chargePeriodSchema),
    defaultValues: {
      buildingId: "",
      title: "",
      type: "MONTHLY",
      startsOn: "",
      endsOn: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createPeriod.mutateAsync(values);
      toast.success("دوره شارژ تعریف شد");
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
      title="تعریف دوره شارژ"
      description="پس از تعریف دوره، ردیف‌های هزینه را اضافه و سپس صورت‌حساب‌ها را صادر کنید."
    >
      <form onSubmit={onSubmit} className="mt-4">
        <AppField label="ساختمان" error={errors.buildingId?.message}>
          <AppSelect {...register("buildingId")}>
            <option value="">انتخاب کنید…</option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </AppSelect>
        </AppField>

        <AppField label="عنوان دوره" error={errors.title?.message}>
          <AppInput placeholder="مثلاً شارژ تیرماه" {...register("title")} />
        </AppField>

        <AppField label="نوع دوره" error={errors.type?.message}>
          <AppSelect {...register("type")}>
            {Object.entries(PERIOD_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </AppSelect>
        </AppField>

        <div className="grid grid-cols-2 gap-3">
          <AppField label="شروع" error={errors.startsOn?.message}>
            <AppInput type="date" dir="ltr" {...register("startsOn")} />
          </AppField>
          <AppField label="پایان" error={errors.endsOn?.message}>
            <AppInput type="date" dir="ltr" {...register("endsOn")} />
          </AppField>
        </div>

        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="submit"
            disabled={createPeriod.isPending}
            className="h-[46px] flex-1"
          >
            ثبت دوره
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
