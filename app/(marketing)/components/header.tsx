import Image from "next/image";
import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { GoldButton } from "./landing-buttons";

const NAV_LINKS = [
  { href: "#features", label: "امکانات" },
  { href: "#roles", label: "برای چه کسانی" },
  { href: "#how", label: "نحوه کار" },
  { href: "#faq", label: "سؤالات متداول" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--sk-border-subtle)] bg-[color-mix(in_srgb,var(--sk-bg)_78%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-[1200px] items-center gap-6 px-8 max-[560px]:px-5">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="size-11 overflow-hidden rounded-xl bg-[var(--sk-bg)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--sk-gold)_35%,transparent)]">
            <Image
              src="/sakena-mark.jpg"
              alt="ساکنا"
              width={44}
              height={44}
              className="size-full object-cover"
            />
          </div>
          <div className="leading-tight">
            <div className="text-[19px] font-extrabold tracking-wide text-[var(--sk-text)]">
              ساکِنا
            </div>
            <div className="text-[10.5px] tracking-widest text-[var(--sk-text-muted)]">
              SAKENA
            </div>
          </div>
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-7 max-[900px]:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14.5px] text-[var(--sk-text-muted)] no-underline transition-colors hover:text-[var(--sk-gold-light)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-[14.5px] font-semibold text-[var(--sk-text-muted)] no-underline transition-colors hover:text-[var(--sk-gold-light)]"
          >
            ورود
          </Link>
          <GoldButton href="/login" className="h-[42px] px-5 text-sm">
            درخواست دمو
            <ArrowLeft className="size-[18px]" />
          </GoldButton>
        </div>
      </div>
    </header>
  );
}
