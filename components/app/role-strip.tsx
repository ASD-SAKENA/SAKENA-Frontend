"use client";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/auth.store";

import { roleHomePath } from "@/lib/app-nav";
import { cn } from "@/lib/utils";

import type { Role } from "@/types/app.type";

const ROLES: { key: Role; label: string }[] = [
  { key: "resident", label: "ساکن" },
  { key: "manager", label: "مدیر" },
  { key: "staff", label: "کارکن" },
];

/**
 * Preview-only role switcher (mirrors the design). Lets you jump between the
 * resident/manager/staff experiences without separate logins while there is no
 * backend. Remove once real role-scoped auth is wired.
 */
export function RoleStrip() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setRole = useAuthStore((s) => s.setRole);

  const active = user?.role ?? "resident";

  const onSwitch = (role: Role) => {
    setRole(role);
    router.push(roleHomePath(role));
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5 border-b border-app-border bg-app-surface2 px-6 py-[9px]">
      <span className="text-xs text-app-muted">پیش‌نمایش نقش:</span>
      <div className="flex gap-1.5 rounded-[10px] border border-app-border bg-app-bg p-[3px]">
        {ROLES.map((r) => {
          const isActive = active === r.key;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => onSwitch(r.key)}
              className={cn(
                "h-8 rounded-lg px-4 text-[13px] font-semibold transition-colors",
                isActive
                  ? "bg-app-gold text-app-gold-fg"
                  : "text-app-muted hover:text-app-fg",
              )}
            >
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
