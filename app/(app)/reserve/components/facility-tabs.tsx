"use client";

import { AppIcon } from "@/components/app/app-icon";

import { useReserveStore } from "@/stores/reserve.store";

import { useSelectedFacility } from "@/hooks/use-selected-facility";

import { cn } from "@/lib/utils";

export function FacilityTabs() {
  const { facilities, selected } = useSelectedFacility();
  const setFacility = useReserveStore((s) => s.setFacility);

  if (facilities.length === 0) {
    return (
      <div className="flex h-[48px] items-center rounded-xl border border-app-border bg-app-surface px-4 text-[13px] text-app-muted">
        هنوز امکاناتی برای رزرو ثبت نشده است
      </div>
    );
  }

  return (
    <div className="flex gap-[5px] rounded-xl border border-app-border bg-app-surface p-[5px]">
      {facilities.map((facility) => {
        const active = selected?.id === facility.id;
        return (
          <button
            key={facility.id}
            type="button"
            onClick={() => setFacility(facility.id)}
            className={cn(
              "flex h-[38px] items-center gap-1.5 rounded-[9px] px-[13px] text-[13.5px] font-semibold whitespace-nowrap transition-[background,color]",
              active
                ? "bg-app-gold text-app-gold-fg"
                : "bg-transparent text-app-muted hover:text-app-fg",
            )}
          >
            <AppIcon name={facility.icon} className="size-[18px]" />
            {facility.label}
          </button>
        );
      })}
    </div>
  );
}
