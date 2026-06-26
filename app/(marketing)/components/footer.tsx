import Image from "next/image";
import Link from "next/link";

import type { LandingFooterColumn } from "@/types/landing.type";

interface Props {
  columns: LandingFooterColumn[];
}

export function Footer({ columns }: Props) {
  return (
    <footer className="border-t border-[var(--sk-border-subtle)] bg-[var(--sk-bg)]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 px-8 pt-14 pb-[30px] max-[560px]:grid-cols-1 max-[560px]:px-5">
        <div>
          <div className="mb-4 flex items-center gap-[11px]">
            <div className="size-10 overflow-hidden rounded-[11px] bg-[var(--sk-bg)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--sk-gold)_30%,transparent)]">
              <Image
                src="/sakena-mark.jpg"
                alt="ساکنا"
                width={40}
                height={40}
                className="size-full object-cover"
              />
            </div>
            <div className="text-lg font-extrabold">ساکِنا</div>
          </div>
          <p className="max-w-[280px] text-[13.5px] leading-[2] text-[var(--sk-text-faint)]">
            پلتفرم یکپارچه مدیریت مجتمع‌های مسکونی برای ساکنین، مدیران و
            کارکنان.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <div className="mb-4 text-sm font-bold">{column.title}</div>
            <div className="flex flex-col gap-[11px]">
              {column.links.map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="text-[13.5px] text-[var(--sk-text-muted)] no-underline transition-colors hover:text-[var(--sk-gold-light)]"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 border-t border-[var(--sk-border-subtle)] px-8 py-5 max-[560px]:px-5">
        <span className="text-[12.5px] text-[var(--sk-text-faint)]">
          © ۱۴۰۴ ساکِنا — تمامی حقوق محفوظ است.
        </span>
        <div className="flex gap-4">
          <Link
            href="#"
            className="text-[12.5px] text-[var(--sk-text-muted)] no-underline transition-colors hover:text-[var(--sk-gold-light)]"
          >
            قوانین
          </Link>
          <Link
            href="#"
            className="text-[12.5px] text-[var(--sk-text-muted)] no-underline transition-colors hover:text-[var(--sk-gold-light)]"
          >
            حریم خصوصی
          </Link>
        </div>
      </div>
    </footer>
  );
}
