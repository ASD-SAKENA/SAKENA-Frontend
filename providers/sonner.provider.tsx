"use client";

import { Toaster } from "sonner";

export default function SonnerProvider() {
  return (
    <Toaster
      position="bottom-center"
      dir="rtl"
      toastOptions={{
        className: "!font-sans !items-start",
        duration: 3000,
        classNames: {
          toast: "!border-border !bg-popover !text-popover-foreground",
          title: "!text-sm",
          description: "!text-xs !text-justify",
          success:
            "!border-sky-200 !bg-sky-50 !text-sky-700 [&_[data-icon]]:!text-sky-600",
          info: "!border-slate-200 !bg-slate-50 !text-slate-700 [&_[data-icon]]:!text-slate-600",
          error:
            "!border-red-200 !bg-red-50 !text-red-700 [&_[data-icon]]:!text-red-600",
          warning:
            "!border-orange-200 !bg-orange-50 !text-orange-700 [&_[data-icon]]:!text-orange-600",
        },
      }}
    />
  );
}
