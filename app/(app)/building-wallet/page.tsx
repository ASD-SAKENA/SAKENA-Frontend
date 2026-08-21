"use client";

import { useState } from "react";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { KpiCard } from "@/components/app/kpi-card";
import { SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";

import {
  useBuildingLedgerQuery,
  useBuildingWalletQuery,
} from "@/queries/wallet";

import { formatFaDate } from "@/lib/format-date";
import { faNumber } from "@/lib/persian-number";
import { cn } from "@/lib/utils";
import { TRANSACTION_CATEGORY_META } from "@/lib/wallet";

import { TransactionModal } from "./components/transaction-modal";

export default function BuildingWalletPage() {
  const { data: balance = 0 } = useBuildingWalletQuery();
  const { data: ledger = [] } = useBuildingLedgerQuery();
  const [composerOpen, setComposerOpen] = useState(false);

  const income = ledger
    .filter((tx) => tx.direction === "CREDIT")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const spending = ledger
    .filter((tx) => tx.direction === "DEBIT")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="sk-page">
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-app-border bg-[linear-gradient(135deg,#1A2336,#0F1626)] p-[22px] text-[#ECEEF3] shadow-[var(--ap-shadow)]">
          <div className="text-[13px] text-[#9CA3B0]">موجودی حساب ساختمان</div>
          <div
            dir="ltr"
            className="my-[10px] mb-[18px] text-[30px] font-extrabold text-[#E6CC8A]"
          >
            {faNumber(balance)}{" "}
            <span className="text-[14px] font-medium text-[#9CA3B0]">
              تومان
            </span>
          </div>
          <AppButton variant="gold" onClick={() => setComposerOpen(true)}>
            <AppIcon name="add" className="size-[19px]" />
            ثبت تراکنش
          </AppButton>
        </div>

        <KpiCard
          label="مجموع دریافتی‌ها"
          value={faNumber(income)}
          sub="تومان"
          icon="trending_up"
          color="success"
        />
        <KpiCard
          label="مجموع مخارج"
          value={faNumber(spending)}
          sub="تومان"
          icon="receipt_long"
          color="warning"
        />
      </div>

      <SectionCard title="دفتر تراکنش‌های ساختمان" bodyClassName="p-0">
        {ledger.length === 0 ? (
          <p className="px-5 py-6 text-[13px] text-app-muted">
            هنوز تراکنشی در حساب ساختمان ثبت نشده است.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-right text-[13.5px]">
              <thead>
                <tr className="text-[12.5px] text-app-muted">
                  <th className="px-5 py-[13px] font-medium">شرح</th>
                  <th className="px-5 py-[13px] font-medium">دسته</th>
                  <th className="px-5 py-[13px] font-medium">تاریخ</th>
                  <th className="px-5 py-[13px] font-medium">مبلغ</th>
                  <th className="px-5 py-[13px] font-medium">مانده پس از آن</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((tx) => {
                  const meta = TRANSACTION_CATEGORY_META[tx.category];
                  const outgoing = tx.direction === "DEBIT";
                  return (
                    <tr key={tx.id} className="border-t border-app-border">
                      <td className="px-5 py-[13px] font-semibold text-app-fg">
                        {tx.description}
                      </td>
                      <td className="px-5 py-[13px]">
                        <StatusBadge color={meta.color}>
                          {meta.label}
                        </StatusBadge>
                      </td>
                      <td className="px-5 py-[13px] text-app-muted">
                        {formatFaDate(tx.occurredAt)}
                      </td>
                      <td
                        className={cn(
                          "px-5 py-[13px] font-bold",
                          outgoing ? "text-app-danger" : "text-app-success",
                        )}
                      >
                        {outgoing ? "−" : "+"}
                        {faNumber(tx.amount)}
                      </td>
                      <td className="px-5 py-[13px] text-app-fg">
                        {faNumber(tx.balanceAfter)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <TransactionModal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
      />
    </div>
  );
}
