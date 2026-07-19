"use client";

import { useState } from "react";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";

import { useAuthStore } from "@/stores/auth.store";
import { useReserveStore } from "@/stores/reserve.store";

import { useSelectedFacility } from "@/hooks/use-selected-facility";

import { toFaDigits } from "@/lib/persian-number";
import { weekLabel } from "@/lib/reserve-time";

import { FacilityManageModal } from "./components/facility-manage-modal";
import { FacilityTabs } from "./components/facility-tabs";
import { ReserveCalendar } from "./components/reserve-calendar";
import { ReserveComposer } from "./components/reserve-composer";

export default function ReservePage() {
  const weekOffset = useReserveStore((s) => s.weekOffset);
  const prevWeek = useReserveStore((s) => s.prevWeek);
  const nextWeek = useReserveStore((s) => s.nextWeek);
  const thisWeek = useReserveStore((s) => s.thisWeek);
  const role = useAuthStore((s) => s.user?.role);
  const [manageOpen, setManageOpen] = useState(false);
  const { selected } = useSelectedFacility();

  const label = weekLabel(weekOffset);

  return (
    <div className="sk-page">
      {/* toolbar */}
      <div className="mb-[14px] flex flex-wrap items-center gap-[14px]">
        <FacilityTabs />

        {role === "manager" ? (
          <>
            <AppButton
              variant="outline"
              onClick={() => setManageOpen(true)}
              className="h-[48px] gap-1.5 px-3.5 text-[13px]"
            >
              <AppIcon name="settings" className="size-[18px]" />
              مدیریت امکانات
            </AppButton>
            <FacilityManageModal
              open={manageOpen}
              onClose={() => setManageOpen(false)}
            />
          </>
        ) : null}

        <div className="mr-auto flex items-center gap-2">
          <button
            type="button"
            onClick={thisWeek}
            className="h-[38px] rounded-[10px] border border-app-border bg-transparent px-[14px] text-[13px] font-semibold text-app-fg transition-[border-color] hover:border-app-gold"
          >
            این هفته
          </button>
          <button
            type="button"
            onClick={prevWeek}
            aria-label="هفته قبل"
            className="flex size-[38px] items-center justify-center rounded-[10px] border border-app-border bg-transparent text-app-fg transition-[border-color] hover:border-app-gold"
          >
            <AppIcon name="chevron_right" className="size-5" />
          </button>
          <div className="min-w-[150px] text-center text-[14px] font-bold">
            {label}
          </div>
          <button
            type="button"
            onClick={nextWeek}
            aria-label="هفته بعد"
            className="flex size-[38px] items-center justify-center rounded-[10px] border border-app-border bg-transparent text-app-fg transition-[border-color] hover:border-app-gold"
          >
            <AppIcon name="chevron_left" className="size-5" />
          </button>
        </div>
      </div>

      {/* legend */}
      <div className="mb-3 flex flex-wrap items-center gap-[18px] text-[12.5px] text-app-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-[13px] rounded bg-[linear-gradient(180deg,var(--ap-gold-light),var(--ap-gold))]" />
          رزرو شما
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-[13px] rounded bg-[color-mix(in_srgb,var(--ap-info)_40%,transparent)]" />
          رزرو دیگران
        </span>
        {selected ? (
          <span className="flex items-center gap-1.5">
            <AppIcon name="groups" className="size-[17px] text-app-steel" />
            ظرفیت هر سانس: {toFaDigits(selected.capacity)} نفر
          </span>
        ) : null}
        <span className="mr-auto flex items-center gap-1.5">
          <AppIcon
            name="drag_indicator"
            className="size-[17px] text-app-gold"
          />
          برای رزرو، روی بازه‌ی دلخواه بکشید یا کلیک کنید
        </span>
      </div>

      <ReserveCalendar />
      <ReserveComposer />
    </div>
  );
}
