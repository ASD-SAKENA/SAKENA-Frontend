"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppInput } from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";

import { useFundWalletMutation } from "@/queries/wallet";

import { type TopUpForm, topUpSchema } from "@/schemas/wallet.schema";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TopUpWalletModal({ open, onClose }: Props) {
  const fundWallet = useFundWalletMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TopUpForm>({
    resolver: zodResolver(topUpSchema),
    defaultValues: { amount: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await fundWallet.mutateAsync(Number(values.amount));
      toast.success("کیف پول با موفقیت شارژ شد");
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
      title="شارژ کیف پول"
      description="مبلغ واریزی بلافاصله به موجودی کیف پول شما اضافه می‌شود."
      icon="account_balance_wallet"
    >
      <form onSubmit={onSubmit} className="mt-4">
        <AppField label="مبلغ (تومان)" error={errors.amount?.message}>
          <AppInput dir="ltr" placeholder="500000" {...register("amount")} />
        </AppField>

        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="submit"
            disabled={fundWallet.isPending}
            className="h-[46px] flex-1"
          >
            شارژ کیف پول
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
