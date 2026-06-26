"use client";

import {
  ArrowLeft,
  CirclePlay,
  CloudCheck,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import type { LandingHeroPreview } from "@/types/landing.type";

import { ACCENT_TEXT } from "./accents";
import { GoldButton, OutlineButton } from "./landing-buttons";

interface Props {
  hero: LandingHeroPreview;
}

const rise = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
};

export function Hero({ hero }: Props) {
  return (
    <section className="relative mx-auto max-w-[1200px] px-8 pt-18 pb-20 max-[560px]:px-5">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[480px] w-[760px] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,color-mix(in_srgb,var(--sk-gold)_12%,transparent)_0%,transparent_70%)]" />

      <div className="relative grid grid-cols-[1.05fr_0.95fr] items-center gap-14 max-[900px]:grid-cols-1 max-[900px]:text-center">
        <motion.div
          variants={rise}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.3, 1] }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--sk-gold)_30%,transparent)] bg-[color-mix(in_srgb,var(--sk-gold)_10%,transparent)] px-3.5 py-[7px] text-[13px] text-[var(--sk-gold-light)]">
            <span className="size-[7px] rounded-full bg-[var(--sk-green)]" />
            پلتفرم یکپارچه مدیریت ساختمان
          </div>

          <h1 className="mb-[22px] text-[52px] leading-[1.35] font-black max-[900px]:text-[38px] max-[560px]:text-[31px]">
            مدیریت مجتمع مسکونی،
            <br />
            <span className="bg-[linear-gradient(120deg,var(--sk-gold-light),var(--sk-gold))] bg-clip-text text-transparent">
              بدون کاغذ، بدون دردسر.
            </span>
          </h1>

          <p className="mb-[34px] max-w-[520px] text-[17px] leading-[2.1] text-[var(--sk-text-muted)] max-[900px]:mx-auto">
            شارژ و حساب‌ها، رزرو امکانات مشترک، درخواست‌های خدماتی و اطلاع‌رسانی
            — همه در یک سامانه‌ی امن برای ساکنین، مدیران و کارکنان ساختمان.
          </p>

          <div className="mb-[34px] flex flex-wrap gap-3.5 max-[900px]:justify-center">
            <GoldButton href="/login" className="h-13 px-7 text-base">
              شروع رایگان
              <ArrowLeft className="size-5" />
            </GoldButton>
            <OutlineButton href="#how" className="h-13 px-[26px] text-[15.5px]">
              <CirclePlay className="size-5 text-[var(--sk-gold)]" />
              مشاهده دمو
            </OutlineButton>
          </div>

          <div className="flex items-center gap-[18px] text-[13px] text-[var(--sk-text-faint)] max-[900px]:justify-center">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-[18px] text-[var(--sk-green)]" />
              درگاه پرداخت امن
            </span>
            <span className="flex items-center gap-1.5">
              <CloudCheck className="size-[18px] text-[var(--sk-green)]" />
              پشتیبان‌گیری ابری
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={rise}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.3, 1], delay: 0.15 }}
          className="relative mx-auto w-full max-w-[480px]"
        >
          <PreviewCard hero={hero} />
        </motion.div>
      </div>
    </section>
  );
}

function PreviewCard({ hero }: Props) {
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-[20px] border border-[var(--sk-border-strong)] bg-[var(--sk-surface-deep)] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <div className="flex h-[42px] items-center gap-[7px] border-b border-[var(--sk-border-strong)] bg-[var(--sk-surface-raised)] px-4">
          <span className="size-[11px] rounded-full bg-[var(--sk-red)]" />
          <span className="size-[11px] rounded-full bg-[var(--sk-amber)]" />
          <span className="size-[11px] rounded-full bg-[var(--sk-green)]" />
          <span className="ms-auto text-[11px] text-[var(--sk-text-faint)]">
            {hero.url}
          </span>
        </div>

        <div className="p-[18px]">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-bold">داشبورد مدیریت</div>
            <div className="flex size-[30px] items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--sk-gold)_15%,transparent)] text-xs font-bold text-[var(--sk-gold)]">
              س
            </div>
          </div>

          <div className="mb-3.5 grid grid-cols-2 gap-2.5">
            {hero.kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl border border-[var(--sk-border-strong)] bg-[var(--sk-surface-raised)] p-[13px]"
              >
                <div className="text-[10.5px] text-[var(--sk-text-muted)]">
                  {kpi.label}
                </div>
                <div
                  className={cn(
                    "mt-1.5 text-[19px] font-extrabold",
                    ACCENT_TEXT[kpi.accent],
                  )}
                >
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[var(--sk-border-strong)] bg-[var(--sk-surface-raised)] p-3.5">
            <div className="mb-3 text-[11px] text-[var(--sk-text-muted)]">
              روند وصولی شارژ
            </div>
            <div className="flex h-[78px] items-end gap-2">
              {hero.bars.map((height, i) => (
                <motion.div
                  key={i}
                  className="flex-1 origin-bottom rounded-t-[5px] bg-[linear-gradient(180deg,var(--sk-gold-light),var(--sk-gold))]"
                  style={{ height: `${height}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute -right-[18px] -bottom-[18px] flex items-center gap-2.5 rounded-[14px] border border-[var(--sk-border-strong)] bg-[var(--sk-surface-raised)] px-4 py-3 shadow-[0_14px_30px_rgba(0,0,0,0.45)]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
      >
        <div className="flex size-9 items-center justify-center rounded-[10px] bg-[color-mix(in_srgb,var(--sk-green)_16%,transparent)] text-[var(--sk-green)]">
          <Wallet className="size-5" />
        </div>
        <div>
          <div className="text-xs text-[var(--sk-text-muted)]">
            {hero.badgeLabel}
          </div>
          <div className="text-sm font-bold">{hero.badgeValue}</div>
        </div>
      </motion.div>
    </div>
  );
}
