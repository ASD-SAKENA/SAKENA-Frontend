"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAppUiStore } from "@/stores/app-ui.store";
import { useAuthStore } from "@/stores/auth.store";

import { navForRole } from "@/lib/app-nav";
import { cn } from "@/lib/utils";

import { AppIcon } from "./app-icon";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navOpen = useAppUiStore((s) => s.navOpen);
  const closeNav = useAppUiStore((s) => s.closeNav);

  const role = user?.role ?? "resident";
  const items = navForRole(role);

  const onLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen w-[248px] flex-shrink-0 flex-col border-l border-app-border bg-app-surface transition-transform",
        "max-[880px]:fixed max-[880px]:top-0 max-[880px]:right-0 max-[880px]:z-[80] max-[880px]:shadow-[-16px_0_50px_rgba(0,0,0,0.45)]",
        navOpen
          ? "max-[880px]:translate-x-0"
          : "max-[880px]:translate-x-[105%]",
      )}
    >
      <div className="flex items-center gap-3 border-b border-app-border p-[18px]">
        <div className="size-[42px] flex-shrink-0 overflow-hidden rounded-[11px] bg-[#0a0e1a] shadow-[0_0_0_1px_var(--ap-border)]">
          <Image
            src="/sakena-mark.jpg"
            alt="ساکنا"
            width={42}
            height={42}
            className="size-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="text-[17px] font-extrabold text-app-fg">ساکِنا</div>
          <div className="text-[11.5px] text-app-muted">{user?.unit}</div>
        </div>
        <button
          type="button"
          onClick={closeNav}
          className="hidden size-[34px] items-center justify-center rounded-[9px] bg-app-surface2 text-app-fg max-[880px]:flex"
        >
          <AppIcon name="close" className="size-5" />
        </button>
      </div>

      <nav className="sk-scroll flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeNav}
              className={cn(
                "flex items-center gap-3 rounded-[11px] px-[13px] py-[11px] text-right transition-colors",
                active
                  ? "bg-[var(--ap-gold-soft)] font-semibold text-app-gold"
                  : "text-app-muted hover:bg-app-surface2",
              )}
            >
              <AppIcon name={item.icon} className="size-[21px]" />
              <span className="flex-1 text-[14.5px]">{item.label}</span>
              {item.badge ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-[10px] bg-app-gold px-1.5 text-[11px] font-bold text-app-gold-fg">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-app-border p-3">
        <div className="flex items-center gap-3 rounded-[11px] px-2.5 py-2">
          <div className="flex size-[38px] items-center justify-center rounded-full bg-[var(--ap-gold-soft)] text-[15px] font-bold text-app-gold">
            {user?.initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13.5px] font-semibold text-app-fg">
              {user?.name}
            </div>
            <div className="text-[11.5px] text-app-muted">
              {user?.roleLabel}
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            title="خروج"
            className="flex rounded-lg p-1.5 text-app-muted hover:text-app-danger"
          >
            <AppIcon name="logout" className="size-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
