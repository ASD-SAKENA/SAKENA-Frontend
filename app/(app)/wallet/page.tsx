"use client";

import { useMemo, useState } from "react";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { KpiCard } from "@/components/app/kpi-card";
import { SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";

import { useMyInvoicesQuery } from "@/queries/billing";
import {
  usePaymentSubmissionsQuery,
  useWalletQuery,
} from "@/queries/wallet";

import { INVOICE_STATUS_META } from "@/lib/billing";
import { formatFaDate } from "@/lib/format-date";
import { faNumber } from "@/lib/persian-number";
import { cn } from "@/lib/utils";

import type { UnitInvoiceApiResponse } from "@/types/billing.api.type";
import type { PaymentApiStatus } from "@/types/wallet.api.type";
import type { StatusColor } from "@/types/app.type";

import { PayChargeModal } from "./pay-charge-modal";
import { TopUpWalletModal } from "./top-up-wallet-modal";

const PAYMENT_STATUS_META: Record<
  PaymentApiStatus,
  { label: string; color: StatusColor }
> = {
  PENDING: { label: "در انتظار تایید", color: "warning" },
  CONFIRMED: { label: "تایید شده", color: "success" },
  REJECTED: { label: "رد شده", color: "danger" },
};

export default function WalletPage() {
  const { data } = useWalletQuery();
  const { data: invoices = [] } = useMyInvoicesQuery();
  const { data: submissions = [] } = usePaymentSubmissionsQuery();
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [payTarget, setPayTarget] = useState<UnitInvoiceApiResponse | null>(
    null,
  );

  const outstanding = useMemo(
    () => invoices.filter((invoice) => invoice.remaining > 0),
    [invoices],
  );
  const settled = useMemo(
    () => invoices.filter((invoice) => invoice.remaining <= 0),
    [invoices],
  );
  const outstandingTotal = outstanding.reduce(
    (sum, invoice) => sum + invoice.remaining,
    0,
  );

  return (
    <div className="sk-page">
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-app-border bg-[linear-gradient(135deg,#1A2336,#0F1626)] p-[22px] text-[#ECEEF3] shadow-[var(--ap-shadow)]">
          <div className="text-[13px] text-[#9CA3B0]">مانده کیف پول</div>
          <div
            dir="ltr"
            className="my-[10px] mb-[18px] text-[30px] font-extrabold text-[#E6CC8A]"
          >
            {faNumber(data?.balance ?? 0)}{" "}
            <span className="text-[14px] font-medium text-[#9CA3B0]">
              تومان
            </span>
          </div>
          <div className="mb-3 text-[12.5px] text-[#9CA3B0]">
            بدهی باز صورت‌حساب‌ها:{" "}
            <span className="font-semibold text-[#E6CC8A]">
              {faNumber(outstandingTotal)} تومان
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <AppButton variant="gold" onClick={() => setTopUpOpen(true)}>
              شارژ کیف پول
            </AppButton>
            {outstanding[0] ? (
              <AppButton
                variant="outline"
                onClick={() => setPayTarget(outstanding[0] ?? null)}
              >
                پرداخت صورت‌حساب
              </AppButton>
            ) : null}
          </div>
          <TopUpWalletModal
            open={topUpOpen}
            onClose={() => setTopUpOpen(false)}
          />
          <PayChargeModal
            invoice={payTarget}
            open={payTarget !== null}
            onClose={() => setPayTarget(null)}
          />
        </div>

        {data?.stats.map((stat) => (
          <KpiCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            sub={stat.sub}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      <SectionCard title="صورت‌حساب‌های باز" className="mb-4">
        {outstanding.length === 0 ? (
          <p className="text-[13px] text-app-muted">
            صورت‌حساب باز ندارید. وقتی مدیر دوره را صادر کند، اینجا ظاهر می‌شود.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {outstanding.map((invoice) => {
              const meta = INVOICE_STATUS_META[invoice.status];
              return (
                <div
                  key={invoice.id}
                  className="flex flex-col gap-3 rounded-xl border border-app-border bg-app-surface2 px-4 py-3.5 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-bold text-app-fg">
                        {invoice.periodTitle || "صورت‌حساب"}
                      </span>
                      <StatusBadge color={meta.color}>{meta.label}</StatusBadge>
                    </div>
                    {invoice.startsOn && invoice.endsOn ? (
                      <div className="mt-1 text-[12px] text-app-muted">
                        {formatFaDate(invoice.startsOn)} تا{" "}
                        {formatFaDate(invoice.endsOn)}
                      </div>
                    ) : null}
                    <div className="mt-2 flex flex-wrap gap-3 text-[12.5px] text-app-muted">
                      <span>
                        مبلغ کل: {faNumber(invoice.amount)} تومان
                      </span>
                      <span>
                        پرداخت‌شده: {faNumber(invoice.paidAmount)} تومان
                      </span>
                      <span className="font-semibold text-app-warning">
                        مانده: {faNumber(invoice.remaining)} تومان
                      </span>
                    </div>
                  </div>
                  <AppButton
                    variant="gold"
                    className="h-10 shrink-0 px-4"
                    onClick={() => setPayTarget(invoice)}
                  >
                    پرداخت
                  </AppButton>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {settled.length > 0 ? (
        <SectionCard title="صورت‌حساب‌های تسویه‌شده" className="mb-4">
          <div className="flex flex-col gap-2">
            {settled.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-app-border px-4 py-3 text-[13px]"
              >
                <span className="font-semibold text-app-fg">
                  {invoice.periodTitle || "صورت‌حساب"}
                </span>
                <span className="text-app-success">
                  {faNumber(invoice.amount)} تومان · تسویه
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}

      <SectionCard title="وضعیت درخواست‌های پرداخت" className="mb-4" bodyClassName="p-0">
        {submissions.length === 0 ? (
          <p className="px-[18px] py-4 text-[13px] text-app-muted">
            هنوز درخواست پرداختی ثبت نکرده‌اید.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-right text-[13.5px]">
              <thead>
                <tr className="text-[12.5px] text-app-muted">
                  <th className="px-5 py-[13px] font-medium">دوره</th>
                  <th className="px-5 py-[13px] font-medium">مبلغ</th>
                  <th className="px-5 py-[13px] font-medium">پیگیری</th>
                  <th className="px-5 py-[13px] font-medium">وضعیت</th>
                  <th className="px-5 py-[13px] font-medium">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((payment) => {
                  const meta = PAYMENT_STATUS_META[payment.status];
                  return (
                    <tr key={payment.id} className="border-t border-app-border">
                      <td className="px-5 py-[13px] font-semibold text-app-fg">
                        {payment.periodTitle || payment.title}
                        {payment.status === "REJECTED" &&
                        payment.rejectionReason ? (
                          <div className="mt-1 text-[12px] font-normal text-app-danger">
                            {payment.rejectionReason}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-5 py-[13px]">
                        {faNumber(payment.amount)}
                      </td>
                      <td className="px-5 py-[13px] font-mono text-[12.5px] text-app-muted" dir="ltr">
                        {payment.transactionReference}
                      </td>
                      <td className="px-5 py-[13px]">
                        <StatusBadge color={meta.color}>{meta.label}</StatusBadge>
                      </td>
                      <td className="px-5 py-[13px] text-app-muted">
                        {formatFaDate(payment.paidAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="تاریخچه پرداخت‌های تاییدشده"
        bodyClassName="p-0"
        action={
          <AppButton
            variant="outline"
            className="h-9 gap-1.5 px-3.5 text-[13px]"
          >
            <AppIcon name="filter_list" className="size-[18px]" />
            فیلتر
          </AppButton>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-right text-[13.5px]">
            <thead>
              <tr className="text-[12.5px] text-app-muted">
                <th className="px-5 py-[13px] font-medium">شرح</th>
                <th className="px-5 py-[13px] font-medium">تاریخ</th>
                <th className="px-5 py-[13px] font-medium">نوع</th>
                <th className="px-5 py-[13px] font-medium">مبلغ</th>
              </tr>
            </thead>
            <tbody>
              {(data?.transactions ?? []).length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-6 text-center text-[13px] text-app-muted"
                  >
                    پرداخت تاییدشده‌ای ثبت نشده است.
                  </td>
                </tr>
              ) : (
                data?.transactions.map((tx) => (
                  <tr key={tx.id} className="border-t border-app-border">
                    <td className="px-5 py-[13px] font-semibold text-app-fg">
                      {tx.desc}
                    </td>
                    <td className="px-5 py-[13px] text-app-muted">{tx.date}</td>
                    <td className="px-5 py-[13px]">
                      <StatusBadge color={tx.color}>{tx.type}</StatusBadge>
                    </td>
                    <td
                      className={cn(
                        "px-5 py-[13px] font-bold",
                        tx.negative ? "text-app-fg" : "text-app-success",
                      )}
                    >
                      {tx.amount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
