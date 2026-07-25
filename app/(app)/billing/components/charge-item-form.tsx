"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppInput, AppSelect } from "@/components/app/form-controls";

import { useAddChargeItemMutation } from "@/queries/billing";

import { ALLOCATION_LABELS, CHARGE_KIND_LABELS } from "@/lib/billing";

import {
  type ChargeItemForm as ChargeItemFormValues,
  chargeItemSchema,
} from "@/schemas/billing.schema";

interface Props {
  periodId: string;
}

/** Adds a recurring charge, facility cost or one-off expense to a draft period. */
export function ChargeItemForm({ periodId }: Props) {
  const addItem = useAddChargeItemMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChargeItemFormValues>({
    resolver: zodResolver(chargeItemSchema),
    defaultValues: {
      title: "",
      amount: "",
      kind: "RECURRING_CHARGE",
      allocation: "EQUAL",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await addItem.mutateAsync({
        periodId,
        payload: {
          title: values.title,
          amount: Number(values.amount),
          kind: values.kind,
          allocation: values.allocation,
        },
      });
      toast.success("ردیف هزینه اضافه شد");
      reset();
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] md:items-start"
    >
      <AppField label="عنوان هزینه" error={errors.title?.message}>
        <AppInput placeholder="مثلاً شارژ ثابت ماهانه" {...register("title")} />
      </AppField>

      <AppField label="مبلغ (تومان)" error={errors.amount?.message}>
        <AppInput dir="ltr" placeholder="850000" {...register("amount")} />
      </AppField>

      <AppField label="نوع هزینه" error={errors.kind?.message}>
        <AppSelect {...register("kind")}>
          {Object.entries(CHARGE_KIND_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </AppSelect>
      </AppField>

      <AppField label="نحوه تقسیم" error={errors.allocation?.message}>
        <AppSelect {...register("allocation")}>
          {Object.entries(ALLOCATION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </AppSelect>
      </AppField>

      <AppButton
        type="submit"
        disabled={addItem.isPending}
        className="h-[46px] px-5 md:mt-[26px]"
      >
        افزودن
      </AppButton>
    </form>
  );
}
