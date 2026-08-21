"use client";

import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";

import {
  useChargeItemsQuery,
  useCloseChargePeriodMutation,
  useIssueChargePeriodMutation,
  usePendingServiceChargesQuery,
  usePeriodInvoicesQuery,
  useRemoveChargeItemMutation,
} from "@/queries/billing";
import { useUnitsQuery } from "@/queries/units";

import {
  ALLOCATION_LABELS,
  CHARGE_KIND_ICONS,
  CHARGE_KIND_LABELS,
  INVOICE_STATUS_META,
} from "@/lib/billing";
import { faNumber } from "@/lib/persian-number";

import type { ChargePeriodApiResponse } from "@/types/billing.api.type";

import { ChargeItemForm } from "./charge-item-form";

interface Props {
  period: ChargePeriodApiResponse;
}

export function PeriodDetail({ period }: Props) {
  const { data: items = [] } = useChargeItemsQuery(period.id);
  const { data: pendingCharges = [] } = usePendingServiceChargesQuery({
    enabled: period.status === "DRAFT",
  });
  const { data: invoices = [] } = usePeriodInvoicesQuery(period.id);
  const { data: units = [] } = useUnitsQuery(period.buildingId);
  const removeItem = useRemoveChargeItemMutation();
  const issuePeriod = useIssueChargePeriodMutation();
  const closePeriod = useCloseChargePeriodMutation();

  const draft = period.status === "DRAFT";
  const pendingTotal = pendingCharges.reduce(
    (sum, charge) => sum + charge.amount,
    0,
  );
  const total =
    items.reduce((sum, item) => sum + item.amount, 0) + pendingTotal;
  const canIssue = items.length > 0 || pendingCharges.length > 0;
  const collected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const outstanding = invoices.reduce((sum, inv) => sum + inv.remaining, 0);

  const unitNumberOf = (apartmentId: string) =>
    units.find((unit) => unit.id === apartmentId)?.no ?? "—";

  const handleIssue = () => {
    issuePeriod.mutate(period.id, {
      onSuccess: (created) =>
        toast.success(
          `صورت‌حساب برای ${faNumber(created.length)} واحد صادر شد`,
        ),
    });
  };

  const handleClose = () => {
    closePeriod.mutate(period.id, {
      onSuccess: () => toast.success("دوره بسته شد"),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionCard
        title={`ردیف‌های هزینه — ${period.title}`}
        action={
          draft ? (
            <AppButton
              variant="gold"
              onClick={handleIssue}
              disabled={!canIssue || issuePeriod.isPending}
              className="h-9 gap-1.5 px-3.5 text-[13px]"
            >
              <AppIcon name="receipt_long" className="size-[18px]" />
              صدور صورت‌حساب‌ها
            </AppButton>
          ) : period.status === "ISSUED" ? (
            <AppButton
              variant="outline"
              onClick={handleClose}
              disabled={closePeriod.isPending}
              className="h-9 gap-1.5 px-3.5 text-[13px]"
            >
              <AppIcon name="check" className="size-[18px]" />
              بستن دوره
            </AppButton>
          ) : undefined
        }
      >
        {draft ? (
          <div className="mb-4 border-b border-app-border pb-4">
            <ChargeItemForm periodId={period.id} units={units} />
          </div>
        ) : null}

        {draft && pendingCharges.length > 0 ? (
          <div className="mb-4 flex flex-col gap-2 border-b border-app-border pb-4">
            <p className="text-[12.5px] leading-6 text-app-muted">
              هزینه‌های خدماتی تسویه‌شده که با صدور این دوره به صورت‌حساب واحدها
              اضافه می‌شوند (دستمزد از قبل از کیف پول ساختمان پرداخت شده است):
            </p>
            {pendingCharges.map((charge) => (
              <div
                key={charge.id}
                className="flex items-center gap-3 rounded-xl border border-dashed border-app-gold/40 bg-app-surface2 px-3.5 py-2.5"
              >
                <AppIcon name="handyman" className="size-5 text-app-gold" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-semibold text-app-fg">
                    {charge.title}
                  </div>
                  <div className="text-[11.5px] text-app-muted">
                    {charge.target === "SPECIFIC_UNIT"
                      ? `واحد ${unitNumberOf(charge.targetApartmentId ?? "")}`
                      : "تقسیم بین همه واحدها"}
                  </div>
                </div>
                <span className="text-[13.5px] font-bold text-app-gold">
                  {faNumber(charge.amount)}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {items.length === 0 && pendingCharges.length === 0 ? (
          <p className="text-[13px] text-app-muted">
            هنوز ردیف هزینه‌ای برای این دوره ثبت نشده است.
          </p>
        ) : items.length === 0 ? (
          <p className="text-[13px] text-app-muted">
            ردیف دستی ثبت نشده؛ با صدور، فقط هزینه‌های خدماتی بالا در صورت‌حساب
            می‌آید.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-app-border bg-app-surface2 px-3.5 py-2.5"
              >
                <AppIcon
                  name={CHARGE_KIND_ICONS[item.kind]}
                  className="size-5 text-app-steel"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-semibold text-app-fg">
                    {item.title}
                  </div>
                  <div className="text-[11.5px] text-app-muted">
                    {CHARGE_KIND_LABELS[item.kind]} ·{" "}
                    {ALLOCATION_LABELS[item.allocation]}
                  </div>
                </div>
                <span className="text-[13.5px] font-bold text-app-gold">
                  {faNumber(item.amount)}
                </span>
                {draft ? (
                  <button
                    type="button"
                    onClick={() =>
                      removeItem.mutate({
                        periodId: period.id,
                        itemId: item.id,
                      })
                    }
                    aria-label="حذف ردیف"
                    className="text-[12.5px] font-semibold text-app-danger"
                  >
                    حذف
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {canIssue ? (
          <div className="mt-3 flex items-center justify-between border-t border-app-border pt-3 text-[13.5px]">
            <span className="text-app-muted">جمع هزینه‌های دوره</span>
            <span className="font-extrabold text-app-fg">
              {faNumber(total)} تومان
            </span>
          </div>
        ) : null}
      </SectionCard>

      {invoices.length > 0 ? (
        <SectionCard title="وضعیت پرداخت واحدها" bodyClassName="p-0">
          <div className="flex flex-wrap gap-4 border-b border-app-border px-[18px] py-3 text-[13px]">
            <span className="text-app-muted">
              دریافت‌شده:{" "}
              <span className="font-bold text-app-success">
                {faNumber(collected)}
              </span>
            </span>
            <span className="text-app-muted">
              مانده:{" "}
              <span className="font-bold text-app-warning">
                {faNumber(outstanding)}
              </span>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[13.5px]">
              <thead>
                <tr className="text-right text-[12.5px] text-app-muted">
                  <th className="px-[18px] py-[13px] font-medium">واحد</th>
                  <th className="px-[18px] py-[13px] font-medium">مبلغ</th>
                  <th className="px-[18px] py-[13px] font-medium">پرداختی</th>
                  <th className="px-[18px] py-[13px] font-medium">مانده</th>
                  <th className="px-[18px] py-[13px] font-medium">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => {
                  const meta = INVOICE_STATUS_META[invoice.status];
                  return (
                    <tr
                      key={invoice.id}
                      className="border-t border-app-border hover:bg-app-surface2"
                    >
                      <td className="px-[18px] py-[13px] font-bold text-app-fg">
                        {unitNumberOf(invoice.apartmentId)}
                      </td>
                      <td className="px-[18px] py-[13px] text-app-fg">
                        {faNumber(invoice.amount)}
                      </td>
                      <td className="px-[18px] py-[13px] text-app-success">
                        {faNumber(invoice.paidAmount)}
                      </td>
                      <td className="px-[18px] py-[13px] text-app-warning">
                        {faNumber(invoice.remaining)}
                      </td>
                      <td className="px-[18px] py-[13px]">
                        <StatusBadge color={meta.color}>
                          {meta.label}
                        </StatusBadge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
