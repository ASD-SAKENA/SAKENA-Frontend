"use client";

import { useMemo, useState } from "react";

import { AppButton } from "@/components/app/app-button";
import { KpiCard } from "@/components/app/kpi-card";
import { SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";
import { TopUpWalletModal } from "@/components/app/top-up-wallet-modal";

import { useMyInvoicesQuery } from "@/queries/billing";
import { usePaymentSubmissionsQuery, useWalletQuery } from "@/queries/wallet";

import {
  INVOICE_DUE_META,
  INVOICE_STATUS_META,
  invoiceDueUrgency,
  sortInvoicesByDueDate,
} from "@/lib/billing";
import { formatFaDate } from "@/lib/format-date";
import { faNumber } from "@/lib/persian-number";
import { cn } from "@/lib/utils";

import type { StatusColor } from "@/types/app.type";
import type { UnitInvoiceApiResponse } from "@/types/billing.api.type";
import type { PaymentApiStatus } from "@/types/wallet.api.type";

import { InvoiceLineItemsAccordion } from "./components/invoice-line-items-accordion";
import { PayChargeModal } from "./components/pay-charge-modal";

type WalletTab = "payable" | "history";

const TABS: { key: WalletTab; label: string }[] = [
  { key: "payable", label: "قابل پرداخت" },
  { key: "history", label: "تاریخچه تراکنش‌ها" },
];

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
  const [tab, setTab] = useState<WalletTab>("payable");
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [payTarget, setPayTarget] = useState<UnitInvoiceApiResponse | null>(
    null,
  );

  const outstanding = useMemo(
    () =>
      sortInvoicesByDueDate(
        invoices.filter((invoice) => invoice.remaining > 0),
      ),
    [invoices],
  );
  const overdueCount = outstanding.filter(
    (invoice) => invoiceDueUrgency(invoice.endsOn) === "overdue",
  ).length;
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
            بدهی قابل پرداخت:{" "}
            <span className="font-semibold text-[#E6CC8A]">
              {faNumber(outstandingTotal)} تومان
            </span>
            {overdueCount > 0 ? (
              <span className="ms-2 text-[#F87171]">
                · {faNumber(overdueCount)} مورد گذشته از سررسید
              </span>
            ) : null}
          </div>
          <AppButton variant="gold" onClick={() => setTopUpOpen(true)}>
            شارژ کیف پول
          </AppButton>
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

      <div className="mb-4 flex w-fit flex-wrap gap-1.5 rounded-xl border border-app-border bg-app-surface p-1">
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
            {item.key === "payable" && outstanding.length > 0
              ? ` (${faNumber(outstanding.length)})`
              : ""}
          </button>
        ))}
      </div>

      {tab === "payable" ? (
        <SectionCard title="شارژها و صورت‌حساب‌های قابل پرداخت">
          {outstanding.length === 0 ? (
            <p className="text-[13px] text-app-muted">
              صورت‌حساب بازی برای پرداخت ندارید.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {outstanding.map((invoice) => {
                const statusMeta = INVOICE_STATUS_META[invoice.status];
                const urgency = invoiceDueUrgency(invoice.endsOn);
                const dueMeta =
                  urgency === "none" ? null : INVOICE_DUE_META[urgency];
                return (
                  <div
                    key={invoice.id}
                    className={cn(
                      "flex flex-col gap-3 rounded-xl border bg-app-surface2 px-4 py-3.5 sm:flex-row sm:items-center",
                      urgency === "overdue"
                        ? "border-app-danger/40"
                        : "border-app-border",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] font-bold text-app-fg">
                          {invoice.periodTitle || "صورت‌حساب"}
                        </span>
                        <StatusBadge color={statusMeta.color}>
                          {statusMeta.label}
                        </StatusBadge>
                        {dueMeta ? (
                          <StatusBadge color={dueMeta.color}>
                            {dueMeta.label}
                          </StatusBadge>
                        ) : null}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[12.5px] text-app-muted">
                        {invoice.endsOn ? (
                          <span>
                            سررسید:{" "}
                            <span
                              className={cn(
                                "font-semibold",
                                urgency === "overdue"
                                  ? "text-app-danger"
                                  : "text-app-fg",
                              )}
                            >
                              {formatFaDate(invoice.endsOn)}
                            </span>
                          </span>
                        ) : null}
                        {invoice.startsOn && invoice.endsOn ? (
                          <span>
                            دوره: {formatFaDate(invoice.startsOn)} تا{" "}
                            {formatFaDate(invoice.endsOn)}
                          </span>
                        ) : null}
                      </div>
                      {urgency === "overdue" ? (
                        <p className="mt-2 text-[12.5px] font-medium text-app-danger">
                          مهلت این صورت‌حساب گذشته است؛ هرچه زودتر پرداخت کنید.
                        </p>
                      ) : null}
                      <div className="mt-2 flex flex-wrap gap-3 text-[12.5px] text-app-muted">
                        <span>مبلغ کل: {faNumber(invoice.amount)} تومان</span>
                        <span>
                          پرداخت‌شده: {faNumber(invoice.paidAmount)} تومان
                        </span>
                        <span className="font-semibold text-app-warning">
                          مانده: {faNumber(invoice.remaining)} تومان
                        </span>
                      </div>
                      <InvoiceLineItemsAccordion invoiceId={invoice.id} />
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
      ) : (
        <div className="flex flex-col gap-4">
          <SectionCard title="درخواست‌های پرداخت شما" bodyClassName="p-0">
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
                        <tr
                          key={payment.id}
                          className="border-t border-app-border"
                        >
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
                          <td
                            className="px-5 py-[13px] font-mono text-[12.5px] text-app-muted"
                            dir="ltr"
                          >
                            {payment.transactionReference}
                          </td>
                          <td className="px-5 py-[13px]">
                            <StatusBadge color={meta.color}>
                              {meta.label}
                            </StatusBadge>
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

          <SectionCard title="پرداخت‌های تاییدشده" bodyClassName="p-0">
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
                        <td className="px-5 py-[13px] text-app-muted">
                          {tx.date}
                        </td>
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
      )}
    </div>
  );
}
