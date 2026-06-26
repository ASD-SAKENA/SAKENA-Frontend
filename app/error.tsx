"use client";

import { useEffect } from "react";

import Image from "next/image";

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
    <main className="flex h-dvh w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <Image alt="لوگو" src={"/favicon.svg"} width={150} height={150} />
      <h1 className="text-2xl font-bold text-slate-800">مشکلی پیش آمد</h1>
      <p dir="ltr" className="text-sm text-slate-500">
        {error.message}
      </p>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
      >
        تلاش مجدد
      </button>
    </main>
  );
}
