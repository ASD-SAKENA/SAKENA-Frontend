"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { AppSidebar } from "@/components/app/app-sidebar";
import { AppTopbar } from "@/components/app/app-topbar";
import { BottomNav } from "@/components/app/bottom-nav";
import { RequestModal } from "@/components/app/request-modal";
import { RoleStrip } from "@/components/app/role-strip";

import { useAppUiStore } from "@/stores/app-ui.store";
import { useAuthStore } from "@/stores/auth.store";

import { useHydrated } from "@/hooks/use-hydrated";

import { cn } from "@/lib/utils";

function FullScreenLoader() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-app-bg">
      <span className="size-9 animate-spin rounded-full border-2 border-app-border border-t-app-gold" />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navOpen = useAppUiStore((s) => s.navOpen);
  const closeNav = useAppUiStore((s) => s.closeNav);
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.replace("/login");
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated) return <FullScreenLoader />;

  return (
    <div dir="rtl" className="flex min-h-screen bg-app-bg text-app-fg">
      <div
        onClick={closeNav}
        className={cn(
          "fixed inset-0 z-[75] bg-[rgba(5,8,16,0.5)] backdrop-blur-[2px] min-[881px]:hidden",
          navOpen ? "block" : "hidden",
        )}
      />

      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <RoleStrip />
        <main className="flex-1 px-6 py-[26px] pb-10 max-[880px]:px-4 max-[880px]:pb-24">
          {children}
        </main>
      </div>

      <BottomNav />
      <RequestModal />
    </div>
  );
}
