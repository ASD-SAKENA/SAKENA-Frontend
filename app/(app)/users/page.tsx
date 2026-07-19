"use client";

import { useState } from "react";

import { AppSelect } from "@/components/app/form-controls";
import { StatusBadge } from "@/components/app/status-badge";

import { useUsersQuery } from "@/queries/users";

import { toFaDigits } from "@/lib/persian-number";

import type { StatusColor } from "@/types/app.type";
import type { UserApiRole } from "@/types/users.api.type";

const ROLE_META: Record<UserApiRole, { label: string; color: StatusColor }> = {
  RESIDENT: { label: "ساکن", color: "info" },
  MANAGER: { label: "مدیر", color: "gold" },
  STAFF: { label: "کارکن", color: "steel" },
};

const ROLE_FILTERS: { value: UserApiRole | ""; label: string }[] = [
  { value: "", label: "همه نقش‌ها" },
  { value: "RESIDENT", label: "ساکن" },
  { value: "MANAGER", label: "مدیر" },
  { value: "STAFF", label: "کارکن" },
];

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState<UserApiRole | "">("");
  const { data: users = [] } = useUsersQuery(roleFilter || undefined);

  return (
    <div className="sk-page">
      <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
        <AppSelect
          value={roleFilter}
          onChange={(e) => {
            const v = e.target.value;
            if (
              v === "" ||
              v === "RESIDENT" ||
              v === "MANAGER" ||
              v === "STAFF"
            ) {
              setRoleFilter(v);
            }
          }}
          className="h-[38px] w-[200px] rounded-[10px] text-[13px]"
        >
          {ROLE_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </AppSelect>
      </div>

      <div className="overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-[var(--ap-shadow-sm)]">
        <div className="flex items-center justify-between border-b border-app-border px-[18px] py-4">
          <div className="text-[15px] font-bold text-app-fg">
            کاربران سامانه
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-[13.5px]">
            <thead>
              <tr className="text-right text-[12.5px] text-app-muted">
                <th className="px-[18px] py-[13px] font-medium">کاربر</th>
                <th className="px-[18px] py-[13px] font-medium">ایمیل</th>
                <th className="px-[18px] py-[13px] font-medium">نقش</th>
                <th className="px-[18px] py-[13px] font-medium">تخصص</th>
                <th className="px-[18px] py-[13px] font-medium">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-app-border hover:bg-app-surface2"
                >
                  <td className="px-[18px] py-[13px] font-bold text-app-fg">
                    {u.username}
                  </td>
                  <td className="px-[18px] py-[13px] text-app-muted" dir="ltr">
                    {u.email}
                  </td>
                  <td className="px-[18px] py-[13px]">
                    <StatusBadge color={ROLE_META[u.role].color}>
                      {ROLE_META[u.role].label}
                    </StatusBadge>
                  </td>
                  <td className="px-[18px] py-[13px] text-app-fg">
                    {u.specialty ?? "—"}
                  </td>
                  <td className="px-[18px] py-[13px]">
                    <StatusBadge color={u.active ? "success" : "danger"}>
                      {u.active ? "فعال" : "غیرفعال"}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-app-border px-[18px] py-[14px] text-[13px] text-app-muted">
          نمایش {toFaDigits(users.length)} کاربر
        </div>
      </div>
    </div>
  );
}
