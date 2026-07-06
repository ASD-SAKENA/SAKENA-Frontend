"use client";

import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { StatusBadge } from "@/components/app/status-badge";

import { useUnitsQuery } from "@/queries/units";

import type { StatusColor } from "@/types/app.type";

const BALANCE_COLOR: Record<StatusColor, string> = {
  gold: "text-app-gold",
  success: "text-app-success",
  warning: "text-app-warning",
  danger: "text-app-danger",
  info: "text-app-info",
  steel: "text-app-steel",
  muted: "text-app-muted",
};

export default function UnitsPage() {
  const { data: units = [] } = useUnitsQuery();

  const handleAdd = () => {
    toast.success("به‌زودی");
  };

  return (
    <div className="sk-page">
      <div className="overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-[var(--ap-shadow-sm)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-app-border px-[18px] py-4">
          <div className="text-[15px] font-bold text-app-fg">
            واحدها و ساکنین
          </div>
          <AppButton
            variant="gold"
            onClick={handleAdd}
            className="h-[38px] gap-1.5 rounded-[10px] px-3.5 text-[13px]"
          >
            <AppIcon name="add" className="size-[18px]" />
            افزودن واحد
          </AppButton>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-[13.5px]">
            <thead>
              <tr className="text-right text-[12.5px] text-app-muted">
                <th className="px-[18px] py-[13px] font-medium">واحد</th>
                <th className="px-[18px] py-[13px] font-medium">ساکن</th>
                <th className="px-[18px] py-[13px] font-medium">وضعیت سکونت</th>
                <th className="px-[18px] py-[13px] font-medium">مانده شارژ</th>
                <th className="px-[18px] py-[13px] font-medium">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => (
                <tr
                  key={u.no}
                  className="border-t border-app-border hover:bg-app-surface2"
                >
                  <td className="px-[18px] py-[13px] font-bold text-app-fg">
                    {u.no}
                  </td>
                  <td className="px-[18px] py-[13px] text-app-fg">
                    {u.resident}
                  </td>
                  <td className="px-[18px] py-[13px] text-app-muted">
                    {u.tenancy}
                  </td>
                  <td
                    className={`px-[18px] py-[13px] font-semibold ${BALANCE_COLOR[u.balanceColor]}`}
                  >
                    {u.balance}
                  </td>
                  <td className="px-[18px] py-[13px]">
                    <StatusBadge color={u.statusColor}>{u.status}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
