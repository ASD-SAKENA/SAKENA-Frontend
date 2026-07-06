"use client";

import { AppIcon } from "@/components/app/app-icon";

import { FACILITIES } from "@/api/reserve";

import { useReserveStore } from "@/stores/reserve.store";

import { cn } from "@/lib/utils";

export function FacilityTabs() {
  const selFacility = useReserveStore((s) => s.selFacility);
  const setFacility = useReserveStore((s) => s.setFacility);

  return (
    <div className="flex gap-[5px] rounded-xl border border-app-border bg-app-surface p-[5px]">
      {FACILITIES.map((facility) => {
        const active = selFacility === facility.key;
        return (
          <button
            key={facility.key}
            type="button"
            onClick={() => setFacility(facility.key)}
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
