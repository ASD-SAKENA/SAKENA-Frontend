"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppInput, AppSelect } from "@/components/app/form-controls";

import { useAddChargeItemMutation } from "@/queries/billing";

import { ALLOCATION_LABELS, CHARGE_KIND_LABELS } from "@/lib/billing";
import { cn } from "@/lib/utils";

import {
  type ChargeItemForm as ChargeItemFormValues,
  chargeItemSchema,
} from "@/schemas/billing.schema";

import type { Unit } from "@/types/units.type";

interface Props {
  periodId: string;
  /** The period's building units, for a cost that falls on one of them. */
  units: Unit[];
}

const EMPTY_ITEM: ChargeItemFormValues = {
  title: "",
  amount: "",
  kind: "RECURRING_CHARGE",
  allocation: "EQUAL",
  targetApartmentId: "",
};

/** Adds a recurring charge, facility cost or one-off expense to a draft period. */
export function ChargeItemForm({ periodId, units }: Props) {
  const addItem = useAddChargeItemMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ChargeItemFormValues>({
    resolver: zodResolver(chargeItemSchema),
    defaultValues: EMPTY_ITEM,
  });

  const allocation = useWatch({ control, name: "allocation" });
  const targetsOneUnit = allocation === "SPECIFIC_UNIT";

  // RHF docs: reset after an async submit must run outside the submit handler,
  // otherwise the next submit can read empty values while the inputs look filled.
  useEffect(() => {
    if (!isSubmitSuccessful) return;
    reset(EMPTY_ITEM);
  }, [isSubmitSuccessful, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await addItem.mutateAsync({
      periodId,
      payload: {
        title: values.title,
        amount: Number(values.amount),
        kind: values.kind,
        allocation: values.allocation,
        // Sent only for a single-unit cost: the API rejects a target on an
        // item that is split across the building.
        ...(values.allocation === "SPECIFIC_UNIT" && {
          targetApartmentId: values.targetApartmentId,
        }),
      },
    });
    toast.success("ردیف هزینه اضافه شد");
  });

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "grid grid-cols-1 gap-3 md:items-start",
        targetsOneUnit
          ? "md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto]"
          : "md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]",
      )}
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

      {targetsOneUnit ? (
        <AppField label="واحد" error={errors.targetApartmentId?.message}>
          <AppSelect {...register("targetApartmentId")}>
            <option value="">انتخاب واحد…</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                واحد {unit.no}
              </option>
            ))}
          </AppSelect>
        </AppField>
      ) : null}

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
