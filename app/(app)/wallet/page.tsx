"use client";

import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { KpiCard } from "@/components/app/kpi-card";
import { SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";

import { useWalletQuery } from "@/queries/wallet";

import { faNumber } from "@/lib/persian-number";
import { cn } from "@/lib/utils";

export default function WalletPage() {
  const { data } = useWalletQuery();

  const handlePay = () => {
    toast.success("پرداخت با موفقیت انجام شد");
  };

  return (
    <div className="sk-page">
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-app-border bg-[linear-gradient(135deg,#1A2336,#0F1626)] p-[22px] text-[#ECEEF3] shadow-[var(--ap-shadow)]">
          <div className="text-[13px] text-[#9CA3B0]">مانده کیف پول</div>
          <div className="my-[10px] mb-[18px] text-[30px] font-extrabold text-[#E6CC8A]">
            {faNumber(data?.balance ?? 0)}{" "}
            <span className="text-[14px] font-medium text-[#9CA3B0]">
              تومان
            </span>
          </div>
          <AppButton variant="gold" onClick={handlePay}>
            افزایش موجودی
          </AppButton>
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

      <SectionCard
        title="تاریخچه تراکنش‌ها"
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
              {data?.transactions.map((tx, index) => (
                <tr
                  key={`${tx.desc}-${index}`}
                  className="border-t border-app-border"
                >
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
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
