"use client";

import { useEffect } from "react";

import { RotateCw } from "lucide-react";

import { estedad } from "@/app/fonts";

import { brandButtonVariant } from "@/components/brand/brand-buttons";
import { StatusScreen } from "@/components/brand/status-screen";

import "./globals.css";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fa" className={estedad.variable}>
      <body className="bg-[var(--sk-bg)] antialiased">
        <title>خطای سراسری برنامه</title>
        <StatusScreen
          title="برنامه با خطای غیرمنتظره روبه‌رو شد"
          description="لطفاً صفحه را دوباره بارگذاری کنید یا چند لحظه دیگر تلاش کنید."
        >
          {error.digest ? (
            <p
              dir="ltr"
              className="w-full font-mono text-xs text-[var(--sk-text-faint)]"
            >
              ref: {error.digest}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => unstable_retry()}
            className={brandButtonVariant.gold}
          >
            تلاش مجدد
            <RotateCw className="size-[18px]" />
          </button>
        </StatusScreen>
      </body>
    </html>
  );
}
