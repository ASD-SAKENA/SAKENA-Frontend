"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppInput, AppSelect } from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";

import { useRecordBuildingTransactionMutation } from "@/queries/wallet";

import { TRANSACTION_CATEGORY_META } from "@/lib/wallet";

import {
  type BuildingTransactionForm,
  buildingTransactionSchema,
} from "@/schemas/building-wallet.schema";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TransactionModal({ open, onClose }: Props) {
  const recordTransaction = useRecordBuildingTransactionMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BuildingTransactionForm>({
    resolver: zodResolver(buildingTransactionSchema),
    defaultValues: {
      direction: "DEBIT",
      category: "OPERATING_EXPENSE",
      amount: "",
      description: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await recordTransaction.mutateAsync({
        direction: values.direction,
        category: values.category,
        amount: Number(values.amount),
        description: values.description,
      });
      toast.success("تراکنش در حساب ساختمان ثبت شد");
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
      title="ثبت تراکنش حساب ساختمان"
      description="دریافتی‌ها و مخارج ساختمان در همین دفتر ثبت و موجودی به‌روز می‌شود."
    >
      <form onSubmit={onSubmit} className="mt-4">
        <AppField label="نوع تراکنش" error={errors.direction?.message}>
          <AppSelect {...register("direction")}>
            <option value="DEBIT">برداشت (هزینه)</option>
            <option value="CREDIT">واریز (دریافتی)</option>
          </AppSelect>
        </AppField>

        <AppField label="دسته" error={errors.category?.message}>
          <AppSelect {...register("category")}>
            {Object.entries(TRANSACTION_CATEGORY_META).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </AppSelect>
        </AppField>

        <AppField label="مبلغ (تومان)" error={errors.amount?.message}>
          <AppInput dir="ltr" placeholder="1500000" {...register("amount")} />
        </AppField>

        <AppField label="شرح" error={errors.description?.message}>
          <AppInput
            placeholder="مثلاً سرویس دوره‌ای موتورخانه"
            {...register("description")}
          />
        </AppField>

        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="submit"
            disabled={recordTransaction.isPending}
            className="h-[46px] flex-1"
          >
            ثبت تراکنش
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
