import Image from "next/image";

export default function Loading() {
  return (
    <div
      dir="rtl"
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-5 bg-[var(--sk-bg)] text-[var(--sk-text)]"
    >
      <div className="relative size-16">
        <span className="absolute inset-0 rounded-2xl border-2 border-[var(--sk-border-strong)]" />
        <span className="absolute inset-0 animate-spin rounded-2xl border-2 border-transparent border-t-[var(--sk-gold)]" />
        <div className="absolute inset-1.5 overflow-hidden rounded-xl">
          <Image
            src="/sakena-mark.jpg"
            alt="ساکنا"
            width={52}
            height={52}
            className="size-full object-cover"
          />
        </div>
      </div>
      <div className="animate-pulse text-sm text-[var(--sk-text-muted)]">
        در حال بارگذاری…
      </div>
    </div>
  );
}
