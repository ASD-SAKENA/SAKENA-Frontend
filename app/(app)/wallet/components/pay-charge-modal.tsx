"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppInput } from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";

import { usePayInvoiceFromWalletMutation } from "@/queries/billing";
import {
  useMyWalletQuery,
  useSubmitInvoicePaymentMutation,
} from "@/queries/wallet";

import { formatFaDate } from "@/lib/format-date";
import { faNumber } from "@/lib/persian-number";

import {
  type InvoicePaymentForm,
  invoicePaymentSchema,
} from "@/schemas/wallet.schema";

import type { UnitInvoiceApiResponse } from "@/types/billing.api.type";

interface Props {
  invoice: UnitInvoiceApiResponse | null;
  open: boolean;
  onClose: () => void;
}

export function PayChargeModal({ invoice, open, onClose }: Props) {
  const submitPayment = useSubmitInvoicePaymentMutation();
  const payFromWallet = usePayInvoiceFromWalletMutation();
  const { data: balance = 0 } = useMyWalletQuery();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitSuccessful },
  } = useForm<InvoicePaymentForm>({
    resolver: zodResolver(invoicePaymentSchema),
    defaultValues: { amount: "", transactionReference: "" },
  });

  useEffect(() => {
    if (!open || !invoice) return;
    reset({
      amount: String(Math.trunc(invoice.remaining)),
      transactionReference: "",
    });
  }, [open, invoice, reset]);

  useEffect(() => {
    if (!isSubmitSuccessful) return;
    reset({ amount: "", transactionReference: "" });
  }, [isSubmitSuccessful, reset]);

  const amountValue = Number(watch("amount") || 0);
  const canPayFromWallet =
    invoice !== null &&
    amountValue > 0 &&
    amountValue <= invoice.remaining &&
    amountValue <= balance;

  const onSubmit = handleSubmit(async (values) => {
    if (!invoice) return;
    const amount = Number(values.amount);
    if (amount > invoice.remaining) {
      toast.error("مبلغ بیشتر از مانده صورت‌حساب است");
      return;
    }
    const fileInput = document.getElementById(
      "payment-receipt",
    ) as HTMLInputElement | null;
    const receipt = fileInput?.files?.[0] ?? null;
    try {
      await submitPayment.mutateAsync({
        invoiceId: invoice.id,
        amount,
        transactionReference: values.transactionReference,
        receipt,
      });
      toast.success("پرداخت ثبت شد و منتظر تایید مدیر است");
      onClose();
    } catch {
      // Global interceptor already toasted.
    }
  });

  const handlePayFromWallet = async () => {
    if (!invoice) return;
    const amount = Number(watch("amount") || 0);
    if (amount <= 0 || amount > invoice.remaining) {
      toast.error("مبلغ معتبر برای پرداخت از کیف پول وارد کنید");
      return;
    }
    if (amount > balance) {
      toast.error("موجودی کیف پول کافی نیست");
      return;
    }
    try {
      await payFromWallet.mutateAsync({
        invoiceId: invoice.id,
        amount,
      });
      toast.success("صورت‌حساب از کیف پول تسویه شد");
      onClose();
    } catch {
      // Global interceptor already toasted.
    }
  };

  if (!invoice) return null;

  const periodRange =
    invoice.startsOn && invoice.endsOn
      ? `${formatFaDate(invoice.startsOn)} تا ${formatFaDate(invoice.endsOn)}`
      : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="پرداخت صورت‌حساب"
      description="مبلغ و دوره از قبل مشخص است؛ فقط رسید بانکی یا پرداخت از کیف پول را انتخاب کنید."
    >
      <div className="mt-4 rounded-xl border border-app-border bg-app-surface2 px-4 py-3">
        <div className="text-[14px] font-bold text-app-fg">
          {invoice.periodTitle || "صورت‌حساب واحد"}
        </div>
        {periodRange ? (
          <div className="mt-1 text-[12px] text-app-muted">{periodRange}</div>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-4 text-[13px]">
          <span className="text-app-muted">
            مبلغ کل:{" "}
            <span className="font-semibold text-app-fg">
              {faNumber(invoice.amount)} تومان
            </span>
          </span>
          <span className="text-app-muted">
            مانده:{" "}
            <span className="font-semibold text-app-warning">
              {faNumber(invoice.remaining)} تومان
            </span>
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-4">
        <AppField label="مبلغ پرداخت (تومان)" error={errors.amount?.message}>
          <AppInput
            dir="ltr"
            placeholder={String(Math.trunc(invoice.remaining))}
            {...register("amount")}
          />
        </AppField>
        <button
          type="button"
          className="mb-3 text-[12.5px] font-semibold text-app-gold"
          onClick={() =>
            setValue("amount", String(Math.trunc(invoice.remaining)), {
              shouldValidate: true,
            })
          }
        >
          پرداخت کامل مانده
        </button>

        <AppField
          label="شماره پیگیری تراکنش"
          error={errors.transactionReference?.message}
        >
          <AppInput
            dir="ltr"
            placeholder="مثلاً 1234567890"
            {...register("transactionReference")}
          />
        </AppField>

        <AppField label="رسید پرداخت (اختیاری)">
          <input
            id="payment-receipt"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="block w-full text-[13px] text-app-muted file:me-3 file:rounded-lg file:border-0 file:bg-app-surface2 file:px-3 file:py-2 file:text-[13px] file:font-semibold file:text-app-fg"
          />
        </AppField>

        <div className="mt-2 flex flex-col gap-2.5">
          <AppButton
            type="submit"
            disabled={submitPayment.isPending || payFromWallet.isPending}
            className="h-[46px] w-full"
          >
            ثبت رسید بانکی برای تایید مدیر
          </AppButton>
          <AppButton
            type="button"
            variant="outline"
            disabled={
              !canPayFromWallet ||
              submitPayment.isPending ||
              payFromWallet.isPending
            }
            onClick={handlePayFromWallet}
            className="h-[46px] w-full"
          >
            پرداخت فوری از کیف پول ({faNumber(balance)} تومان)
          </AppButton>
          <AppButton
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-[46px] w-full"
          >
            انصراف
          </AppButton>
        </div>
      </form>
    </Modal>
  );
}
