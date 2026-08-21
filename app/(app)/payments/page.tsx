"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppInput } from "@/components/app/form-controls";
import { AppIcon } from "@/components/app/app-icon";
import { Modal } from "@/components/app/modal";
import { SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";

import {
  useConfirmPaymentMutation,
  usePendingPaymentsQuery,
  useRejectPaymentMutation,
} from "@/queries/wallet";

import { useAuthStore } from "@/stores/auth.store";

import { formatFaDate } from "@/lib/format-date";
import { faNumber } from "@/lib/persian-number";

import {
  type RejectPaymentForm,
  rejectPaymentSchema,
} from "@/schemas/wallet.schema";

import type { PaymentApiResponse } from "@/types/wallet.api.type";

export default function PaymentsReviewPage() {
  const role = useAuthStore((s) => s.user?.role);
  const isManager = role === "manager";
  const { data: pending = [], isLoading } = usePendingPaymentsQuery({
    enabled: isManager,
  });
  const confirmPayment = useConfirmPaymentMutation();
  const rejectPayment = useRejectPaymentMutation();
  const [rejectTarget, setRejectTarget] = useState<PaymentApiResponse | null>(
    null,
  );

  if (!isManager) {
    return (
      <div className="sk-page">
        <p className="text-[14px] text-app-muted">
          فقط مدیر ساختمان به صف بررسی پرداخت‌ها دسترسی دارد.
        </p>
      </div>
    );
  }

  return (
    <div className="sk-page">
      <SectionCard
        title="پرداخت‌های در انتظار تایید"
        action={
          <StatusBadge color="warning">
            {faNumber(pending.length)} مورد
          </StatusBadge>
        }
      >
        {isLoading ? (
          <p className="text-[13px] text-app-muted">در حال بارگذاری…</p>
        ) : pending.length === 0 ? (
          <p className="text-[13px] text-app-muted">
            پرداخت معلقی برای بررسی وجود ندارد.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map((payment) => (
              <div
                key={payment.id}
                className="rounded-xl border border-app-border bg-app-surface2 px-4 py-3.5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-[14px] font-bold text-app-fg">
                      {payment.periodTitle || payment.title}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-app-muted">
                      <span>
                        مبلغ:{" "}
                        <span className="font-semibold text-app-fg">
                          {faNumber(payment.amount)} تومان
                        </span>
                      </span>
                      <span dir="ltr">
                        پیگیری: {payment.transactionReference}
                      </span>
                      <span>{formatFaDate(payment.paidAt)}</span>
                      {payment.hasReceipt ? (
                        <span className="inline-flex items-center gap-1 text-app-info">
                          <AppIcon name="attachment" className="size-4" />
                          دارای رسید
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <AppButton
                      variant="gold"
                      className="h-10 px-4"
                      disabled={
                        confirmPayment.isPending || rejectPayment.isPending
                      }
                      onClick={async () => {
                        try {
                          await confirmPayment.mutateAsync(payment.id);
                          toast.success("پرداخت تایید و صورت‌حساب به‌روز شد");
                        } catch {
                          // interceptor
                        }
                      }}
                    >
                      تایید
                    </AppButton>
                    <AppButton
                      variant="outline"
                      className="h-10 px-4"
                      disabled={
                        confirmPayment.isPending || rejectPayment.isPending
                      }
                      onClick={() => setRejectTarget(payment)}
                    >
                      رد
                    </AppButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <RejectPaymentModal
        payment={rejectTarget}
        open={rejectTarget !== null}
        onClose={() => setRejectTarget(null)}
      />
    </div>
  );
}

function RejectPaymentModal({
  payment,
  open,
  onClose,
}: {
  payment: PaymentApiResponse | null;
  open: boolean;
  onClose: () => void;
}) {
  const rejectPayment = useRejectPaymentMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectPaymentForm>({
    resolver: zodResolver(rejectPaymentSchema),
    defaultValues: { reason: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!payment) return;
    try {
      await rejectPayment.mutateAsync({
        id: payment.id,
        reason: values.reason,
      });
      toast.success("پرداخت رد شد");
      reset();
      onClose();
    } catch {
      // interceptor
    }
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="رد پرداخت"
      description={
        payment
          ? `دلیل رد «${payment.periodTitle || payment.title}» را بنویسید.`
          : undefined
      }
    >
      <form onSubmit={onSubmit} className="mt-4">
        <AppField label="دلیل رد" error={errors.reason?.message}>
          <AppInput
            placeholder="مثلاً مبلغ با رسید مطابقت ندارد"
            {...register("reason")}
          />
        </AppField>
        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="submit"
            disabled={rejectPayment.isPending}
            className="h-[46px] flex-1"
          >
            تایید رد
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
