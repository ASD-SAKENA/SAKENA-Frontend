"use client";

import { AppIcon } from "@/components/app/app-icon";

import { cn } from "@/lib/utils";

import type { Role } from "@/types/app.type";

interface Props {
  value: Role;
  onChange: (role: Role) => void;
}

const CHIPS: { key: Role; label: string; icon: string }[] = [
  { key: "resident", label: "ساکن", icon: "home" },
  { key: "manager", label: "مدیر", icon: "admin_panel_settings" },
  { key: "staff", label: "کارکن", icon: "engineering" },
];

export function RoleChips({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {CHIPS.map((chip) => {
        const active = chip.key === value;
        return (
          <button
            key={chip.key}
            type="button"
            onClick={() => onChange(chip.key)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl px-1.5 py-3 transition-all",
              active
                ? "border border-[var(--sk-gold)] bg-[rgba(201,162,78,.12)] text-[var(--sk-gold-light)]"
                : "border border-[#2A3548] bg-[#10172A] text-[var(--sk-text-muted)]",
            )}
          >
            <AppIcon name={chip.icon} className="size-5" />
            <span className="text-[13px] font-semibold">{chip.label}</span>
          </button>
        );
      })}
    </div>
  );
}
