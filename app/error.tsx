"use client";

import { useEffect } from "react";

import { ArrowLeft, RotateCw } from "lucide-react";

import {
  brandButtonVariant,
  BrandLink,
} from "@/components/brand/brand-buttons";
import { StatusScreen } from "@/components/brand/status-screen";

export default function Error({
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
    <StatusScreen
      title="مشکلی پیش آمد"
      description="در پردازش درخواست شما خطایی رخ داد. می‌توانید دوباره تلاش کنید یا به صفحه‌ی اصلی برگردید."
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
      <BrandLink href="/" variant="outline">
        بازگشت به خانه
        <ArrowLeft className="size-[18px]" />
      </BrandLink>
    </StatusScreen>
  );
}
