import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex h-dvh w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <Image alt="لوگو" src={"/favicon.svg"} width={150} height={150} />
      <h1 className="text-2xl font-bold text-slate-800">
        !صفحه مورد نظر پیدا نشد
      </h1>
      <p className="text-sm text-slate-500">
        آدرسی که وارد کردی وجود ندارد یا جابه جا شده است.
      </p>
      <Link
        href="/chat"
        className="mt-2 inline-flex h-10 items-center justify-center rounded-lg bg-slate-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
      >
        برگشت به خانه
      </Link>
    </main>
  );
}
