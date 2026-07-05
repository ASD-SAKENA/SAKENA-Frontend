"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useTheme } from "next-themes";

import { useAppUiStore } from "@/stores/app-ui.store";

import { useHydrated } from "@/hooks/use-hydrated";

import { pageMetaForPath } from "@/lib/app-nav";

import { AppIcon } from "./app-icon";

export function AppTopbar() {
  const pathname = usePathname();
  const openNav = useAppUiStore((s) => s.openNav);
  const { theme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const [title, crumb] = pageMetaForPath(pathname);

  const iconBtn =
    "flex size-10 flex-shrink-0 items-center justify-center rounded-[10px] border border-app-border bg-app-bg text-app-fg hover:border-app-gold";

  return (
    <header className="sticky top-0 z-20 flex h-[66px] flex-shrink-0 items-center gap-4 border-b border-[var(--ap-glass-brd)] bg-[var(--ap-glass-bg)] px-6 backdrop-blur-[18px]">
      <button
        type="button"
        onClick={openNav}
        title="منو"
        className={`${iconBtn} hidden max-[880px]:flex`}
      >
        <AppIcon name="menu" className="size-[22px]" />
      </button>

      <div className="min-w-0 flex-1">
        <div className="text-[18px] font-bold text-app-fg">{title}</div>
        <div className="mt-0.5 text-[12.5px] text-app-muted max-[880px]:hidden">
          {crumb}
        </div>
      </div>

      <div className="relative flex max-w-[280px] flex-1 items-center max-[880px]:hidden">
        <AppIcon
          name="search"
          className="absolute right-3 size-5 text-app-muted"
        />
        <input
          placeholder="جستجو…"
          className="h-10 w-full rounded-[10px] border border-app-border bg-app-bg pr-9 pl-3 text-right text-[13.5px] text-app-fg outline-none focus:border-app-gold"
        />
      </div>

      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        title="تغییر تم"
        className={iconBtn}
      >
        <AppIcon
          name={hydrated && theme === "light" ? "dark_mode" : "light_mode"}
          className="size-[21px]"
        />
      </button>

      <Link href="/style-guide" title="راهنمای طراحی" className={iconBtn}>
        <AppIcon name="palette" className="size-[21px]" />
      </Link>

      <button type="button" title="اعلان‌ها" className={`relative ${iconBtn}`}>
        <AppIcon name="notifications" className="size-[21px]" />
        <span className="absolute top-2 right-2.5 size-[7px] rounded-full bg-app-danger" />
      </button>
    </header>
  );
}
