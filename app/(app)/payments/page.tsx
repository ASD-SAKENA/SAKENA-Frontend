"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { AppField, AppInput } from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";
import { SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";

import {
  useChargePeriodsQuery,
  useOutstandingInvoicesQuery,
} from "@/queries/billing";
import {
  useBuildingPaymentsQuery,
  useBuildingWalletQuery,
  useConfirmPaymentMutation,
  usePendingPaymentsQuery,
  useRejectPaymentMutation,
} from "@/queries/wallet";

import { useAuthStore } from "@/stores/auth.store";

import { INVOICE_STATUS_META } from "@/lib/billing";
import { formatFaDate } from "@/lib/format-date";
import { faNumber } from "@/lib/persian-number";
import { cn } from "@/lib/utils";

import {
  type RejectPaymentForm,
  rejectPaymentSchema,
} from "@/schemas/wallet.schema";

import type { StatusColor } from "@/types/app.type";
import type {
  PaymentApiResponse,
  PaymentApiStatus,
} from "@/types/wallet.api.type";

type Tab = "pending" | "history" | "outstanding";

const TABS: { key: Tab; label: string }[] = [
  { key: "pending", label: "در انتظار تایید" },
  { key: "history", label: "تاریخچه پرداخت‌ها" },
  { key: "outstanding", label: "بدهی‌های باز" },
];

const PAYMENT_STATUS_META: Record<
  PaymentApiStatus,
  { label: string; color: StatusColor }
> = {
  PENDING: { label: "در انتظار", color: "warning" },
  CONFIRMED: { label: "تایید شده", color: "success" },
  REJECTED: { label: "رد شده", color: "danger" },
};

const HISTORY_STATUS_FILTERS: {
  key: PaymentApiStatus | "all";
  label: string;
}[] = [
  { key: "all", label: "همه وضعیت‌ها" },
  { key: "CONFIRMED", label: "تایید شده" },
  { key: "PENDING", label: "در انتظار" },
  { key: "REJECTED", label: "رد شده" },
];

export default function PaymentsPage() {
  const role = useAuthStore((s) => s.user?.role);
  const isManager = role === "manager";
  const [tab, setTab] = useState<Tab>("pending");
  const [periodId, setPeriodId] = useState<string>("");
  const [historyStatus, setHistoryStatus] = useState<PaymentApiStatus | "all">(
    "all",
  );
  const [rejectTarget, setRejectTarget] = useState<PaymentApiResponse | null>(
    null,
  );

  const { data: balance = 0 } = useBuildingWalletQuery();
  const { data: periods = [] } = useChargePeriodsQuery(undefined);
  const issuedPeriods = useMemo(
    () => periods.filter((period) => period.status !== "DRAFT"),
    [periods],
  );

  const { data: pending = [], isLoading: pendingLoading } =
    usePendingPaymentsQuery({ enabled: isManager });
  const { data: history = [], isLoading: historyLoading } =
    useBuildingPaymentsQuery(
      {
        status: historyStatus === "all" ? undefined : historyStatus,
        periodId: periodId || undefined,
      },
      { enabled: isManager && tab === "history" },
    );
  const { data: outstanding = [], isLoading: outstandingLoading } =
    useOutstandingInvoicesQuery(periodId || null, {
      enabled: isManager,
    });

  const confirmPayment = useConfirmPaymentMutation();
  const rejectPayment = useRejectPaymentMutation();

  if (!isManager) {
    return (
      <div className="sk-page">
        <p className="text-[14px] text-app-muted">
          فقط مدیر ساختمان به لیست پرداخت‌ها و بدهی‌ها دسترسی دارد.
        </p>
      </div>
    );
  }

  return (
    <div className="sk-page flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] md:items-stretch">
        <div className="flex flex-col rounded-2xl border border-app-border bg-[linear-gradient(135deg,#1A2336,#0F1626)] p-5 text-[#ECEEF3] shadow-[var(--ap-shadow)]">
          <div className="text-[13px] text-[#9CA3B0]">موجودی حساب ساختمان</div>
          <div
            className="mt-1.5 text-[28px] leading-none font-extrabold text-[#E6CC8A]"
            dir="ltr"
          >
            {faNumber(balance)}{" "}
            <span className="text-[14px] font-medium text-[#9CA3B0]">
              تومان
            </span>
          </div>
          <p className="mt-2.5 max-w-[36ch] text-[12.5px] leading-6 text-[#9CA3B0]">
            وصول شارژ بعد از تایید پرداخت اینجا می‌نشیند.
          </p>
          <Link
            href="/building-wallet"
            className="mt-4 inline-flex h-10 w-fit items-center rounded-xl border border-white/15 px-4 text-[13px] font-semibold text-[#E6CC8A] transition-colors hover:bg-white/5 md:mt-auto"
          >
            دفتر حساب ساختمان
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:auto-rows-fr md:grid-cols-1">
          <SummaryTile
            label="در انتظار تایید"
            value={faNumber(pending.length)}
            tone="warning"
          />
          <SummaryTile
            label="بدهی باز"
            value={faNumber(outstanding.length)}
            tone="danger"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-app-border bg-app-surface p-1">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={cn(
                "h-9 rounded-lg px-3.5 text-[13px] font-semibold transition-colors",
                tab === item.key
                  ? "bg-app-gold text-app-gold-fg"
                  : "text-app-muted hover:text-app-fg",
              )}
            >
              {item.label}
              {item.key === "pending" && pending.length > 0
                ? ` (${faNumber(pending.length)})`
                : ""}
            </button>
          ))}
        </div>

        {tab !== "pending" ? (
          <select
            value={periodId}
            onChange={(event) => setPeriodId(event.target.value)}
            className="h-10 rounded-xl border border-app-border bg-app-surface px-3 text-[13px] text-app-fg"
          >
            <option value="">همه دوره‌ها / رویدادها</option>
            {issuedPeriods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.title}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {tab === "pending" ? (
        <SectionCard title="پرداخت‌های در انتظار تایید">
          {pendingLoading ? (
            <p className="text-[13px] text-app-muted">در حال بارگذاری…</p>
          ) : pending.length === 0 ? (
            <p className="text-[13px] text-app-muted">
              پرداخت معلقی برای بررسی وجود ندارد.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {pending.map((payment) => (
                <PaymentRow
                  key={payment.id}
                  payment={payment}
                  actions={
                    <>
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
                    </>
                  }
                />
              ))}
            </div>
          )}
        </SectionCard>
      ) : null}

      {tab === "history" ? (
        <SectionCard
          title="تاریخچه پرداخت ساکنین"
          action={
            <div className="flex flex-wrap gap-1.5">
              {HISTORY_STATUS_FILTERS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setHistoryStatus(item.key)}
                  className={cn(
                    "h-8 rounded-lg px-2.5 text-[12px] font-semibold",
                    historyStatus === item.key
                      ? "bg-app-surface2 text-app-fg"
                      : "text-app-muted hover:text-app-fg",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          }
        >
          {historyLoading ? (
            <p className="text-[13px] text-app-muted">در حال بارگذاری…</p>
          ) : history.length === 0 ? (
            <p className="text-[13px] text-app-muted">
              پرداختی با این فیلتر ثبت نشده است.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((payment) => (
                <PaymentRow key={payment.id} payment={payment} />
              ))}
            </div>
          )}
        </SectionCard>
      ) : null}

      {tab === "outstanding" ? (
        <SectionCard title="واحدهایی که بدهی باز دارند">
          {outstandingLoading ? (
            <p className="text-[13px] text-app-muted">در حال بارگذاری…</p>
          ) : outstanding.length === 0 ? (
            <p className="text-[13px] text-app-muted">
              بدهی بازی با این فیلتر وجود ندارد.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {outstanding.map((invoice) => {
                const meta = INVOICE_STATUS_META[invoice.status];
                return (
                  <div
                    key={invoice.id}
                    className="rounded-xl border border-app-border bg-app-surface2 px-4 py-3.5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-bold text-app-fg">
                        {invoice.periodTitle || "صورت‌حساب"}
                      </span>
                      <StatusBadge color={meta.color}>{meta.label}</StatusBadge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-app-muted">
                      <span>
                        واحد:{" "}
                        <span className="font-semibold text-app-fg">
                          {invoice.unitNumber || "—"}
                        </span>
                      </span>
                      <span>
                        ساکن:{" "}
                        <span className="font-semibold text-app-fg">
                          {invoice.residentUsername || "بدون ساکن فعال"}
                        </span>
                      </span>
                      <span>
                        مانده:{" "}
                        <span className="font-semibold text-app-warning">
                          {faNumber(invoice.remaining)} تومان
                        </span>
                      </span>
                      <span>
                        کل: {faNumber(invoice.amount)} · پرداخت‌شده:{" "}
                        {faNumber(invoice.paidAmount)}
                      </span>
                      {invoice.endsOn ? (
                        <span>سررسید دوره: {formatFaDate(invoice.endsOn)}</span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      ) : null}

      <RejectPaymentModal
        payment={rejectTarget}
        open={rejectTarget !== null}
        onClose={() => setRejectTarget(null)}
      />
    </div>
  );
}

function SummaryTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "warning" | "danger";
}) {
  return (
    <div className="flex h-full min-h-[5.5rem] flex-col justify-between gap-2 rounded-2xl border border-app-border bg-app-surface px-4 py-3.5 shadow-[var(--ap-shadow-sm)]">
      <div className="text-[12.5px] leading-5 text-app-muted">{label}</div>
      <div
        className={cn(
          "text-[26px] leading-none font-extrabold tabular-nums",
          tone === "warning" ? "text-app-warning" : "text-app-danger",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function PaymentRow({
  payment,
  actions,
}: {
  payment: PaymentApiResponse;
  actions?: React.ReactNode;
}) {
  const meta = PAYMENT_STATUS_META[payment.status];
  return (
    <div className="rounded-xl border border-app-border bg-app-surface2 px-4 py-3.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-bold text-app-fg">
              {payment.periodTitle || payment.title}
            </span>
            <StatusBadge color={meta.color}>{meta.label}</StatusBadge>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-app-muted">
            {payment.unitNumber ? (
              <span>
                واحد:{" "}
                <span className="font-semibold text-app-fg">
                  {payment.unitNumber}
                </span>
              </span>
            ) : null}
            {payment.payerUsername ? (
              <span>
                پرداخت‌کننده:{" "}
                <span className="font-semibold text-app-fg">
                  {payment.payerUsername}
                </span>
              </span>
            ) : null}
            <span>
              مبلغ:{" "}
              <span className="font-semibold text-app-fg">
                {faNumber(payment.amount)} تومان
              </span>
            </span>
            <span dir="ltr">پیگیری: {payment.transactionReference}</span>
            <span>{formatFaDate(payment.paidAt)}</span>
            {payment.hasReceipt ? (
              <span className="inline-flex items-center gap-1 text-app-info">
                <AppIcon name="attachment" className="size-4" />
                دارای رسید
              </span>
            ) : null}
            {payment.status === "REJECTED" && payment.rejectionReason ? (
              <span className="text-app-danger">{payment.rejectionReason}</span>
            ) : null}
          </div>
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
        ) : null}
      </div>
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
