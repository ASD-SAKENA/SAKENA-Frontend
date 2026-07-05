"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuthStore } from "@/stores/auth.store";

import { navForRole } from "@/lib/app-nav";
import { cn } from "@/lib/utils";

import { AppIcon } from "./app-icon";

export function BottomNav() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const items = navForRole(user?.role ?? "resident").slice(0, 4);

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-30 hidden h-[66px] items-center justify-around border-t border-app-border bg-app-surface pb-[env(safe-area-inset-bottom)] max-[880px]:flex">
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-2.5 py-1.5",
              active ? "text-app-gold" : "text-app-muted",
            )}
          >
            <AppIcon name={item.icon} className="size-[23px]" />
            <span className="text-[10.5px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
