"use client";

import { useState } from "react";

import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { Modal } from "@/components/app/modal";

import { useAssignCostResponsibilityMutation } from "@/queries/requests";
import { useSettleRequestMutation } from "@/queries/wallet";

import { faNumber } from "@/lib/persian-number";
import { COST_RESPONSIBILITY_OPTIONS } from "@/lib/service-requests";
import { cn } from "@/lib/utils";

import type { ServiceCostResponsibility } from "@/types/requests.api.type";
import type { ManagerRequest } from "@/types/requests.type";

interface Props {
  request: ManagerRequest | null;
  onClose: () => void;
}

/**
 * Picking how the cost is paid and settling are two backend calls, but one
 * decision for the manager — so they happen behind a single confirm here.
 */
export function SettleRequestModal({ request, onClose }: Props) {
  const [choice, setChoice] = useState<ServiceCostResponsibility | null>(null);
  const assignCost = useAssignCostResponsibilityMutation();
  const settle = useSettleRequestMutation();

  const hasRequestingUnit = request?.requestingUnit !== null;
  const options = COST_RESPONSIBILITY_OPTIONS.filter(
    (o) => !o.requiresRequestingUnit || hasRequestingUnit,
  );
  const pending = assignCost.isPending || settle.isPending;

  const handleClose = () => {
    setChoice(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!request || choice === null) return;
    try {
      await assignCost.mutateAsync({
        id: request.id,
        costResponsibility: choice,
      });
      await settle.mutateAsync(request.id);
      toast.success(
        choice === "BUILDING_WALLET"
          ? `دستمزد «${request.title}» از کیف پول ساختمان به کارکن واریز شد`
          : `دستمزد «${request.title}» به کارکن واریز شد؛ مبلغ در صورت‌حساب دوره بعد ظاهر می‌شود`,
      );
      handleClose();
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  };

  if (!request) return null;

  return (
    <Modal
      open
      onClose={handleClose}
      title="پرداخت دستمزد"
      description={`نحوه پرداخت هزینه «${request.title}» را انتخاب کنید.`}
      icon="payments"
    >
      {request.completionCost !== null ? (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-app-border bg-app-surface2 px-4 py-3">
          <span className="text-[13px] text-app-muted">مبلغ هزینه</span>
          <span className="text-[14.5px] font-bold text-app-gold">
            {faNumber(request.completionCost)} تومان
          </span>
        </div>
      ) : null}

      {!hasRequestingUnit ? (
        <p className="mt-3 text-[12.5px] leading-6 text-app-muted">
          این درخواست به واحد مشخصی متصل نیست، بنابراین تنها از کیف پول ساختمان
          قابل پرداخت است.
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-2.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setChoice(option.value)}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-3.5 text-right transition-colors",
              choice === option.value
                ? "border-app-gold bg-app-surface2"
                : "border-app-border bg-transparent hover:border-app-gold/50",
            )}
          >
            <span
              className={cn(
                "flex size-9 flex-shrink-0 items-center justify-center rounded-lg",
                choice === option.value
                  ? "bg-app-gold text-app-gold-fg"
                  : "bg-app-surface2 text-app-steel",
              )}
            >
              <AppIcon name={option.icon} className="size-[18px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-semibold text-app-fg">
                {option.label}
              </span>
              <span className="mt-0.5 block text-[12px] leading-5 text-app-muted">
                {option.description}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex gap-2.5">
        <AppButton
          type="button"
          onClick={handleSubmit}
          disabled={choice === null || pending}
          className="h-[46px] flex-1"
        >
          تایید و پرداخت
        </AppButton>
        <AppButton
          type="button"
          variant="outline"
          onClick={handleClose}
          className="h-[46px] px-6"
        >
          انصراف
        </AppButton>
      </div>
    </Modal>
  );
}
