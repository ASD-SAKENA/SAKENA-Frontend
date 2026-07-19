"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppInput } from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";

import { useRecordPaymentMutation } from "@/queries/wallet";

import { type PaymentForm, paymentSchema } from "@/schemas/wallet.schema";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function PayChargeModal({ open, onClose }: Props) {
  const recordPayment = useRecordPaymentMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { title: "", amount: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await recordPayment.mutateAsync({
        title: values.title,
        amount: Number(values.amount),
      });
      toast.success("پرداخت با موفقیت ثبت شد");
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
      title="ثبت پرداخت"
      description="پرداخت شما در سوابق پرداخت‌ها ثبت می‌شود."
    >
      <form onSubmit={onSubmit} className="mt-4">
        <AppField label="شرح پرداخت" error={errors.title?.message}>
          <AppInput
            placeholder="مثلاً پرداخت شارژ تیرماه"
            {...register("title")}
          />
        </AppField>

        <AppField label="مبلغ (تومان)" error={errors.amount?.message}>
          <AppInput dir="ltr" placeholder="850000" {...register("amount")} />
        </AppField>

        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="submit"
            disabled={recordPayment.isPending}
            className="h-[46px] flex-1"
          >
            ثبت پرداخت
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
