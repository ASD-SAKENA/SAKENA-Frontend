"use client";

import { useEffect } from "react";

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
    <html lang="fa">
      <body className="bg-background text-foreground">
        <title>خطای سراسری برنامه</title>
        <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-sm font-medium text-rose-500">Application Error</p>
          <h1 className="text-2xl font-bold">
            برنامه با خطای غیرمنتظره روبرو شد
          </h1>
          <p className="text-sm text-slate-500">
            لطفا صفحه را دوباره بارگذاری کن یا چند لحظه دیگر تلاش کن.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="mt-2 inline-flex h-10 items-center justify-center rounded-lg bg-slate-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            تلاش مجدد
          </button>
        </main>
      </body>
    </html>
  );
}
