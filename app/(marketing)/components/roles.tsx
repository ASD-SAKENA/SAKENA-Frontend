"use client";

import { useState } from "react";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

import type { LandingRole, RoleKey } from "@/types/landing.type";

import { LandingIcon } from "./landing-icon";
import { SectionHeading } from "./section-heading";

interface Props {
  roles: LandingRole[];
}

export function Roles({ roles }: Props) {
  const [activeKey, setActiveKey] = useState<RoleKey>("manager");
  const active = roles.find((role) => role.key === activeKey) ?? roles[0];

  return (
    <section
      id="roles"
      className="border-y border-[var(--sk-border-subtle)] bg-[var(--sk-bg-band)]"
    >
      <div className="mx-auto max-w-[1100px] px-8 py-[90px] max-[560px]:px-5">
        <SectionHeading
          eyebrow="برای هر نقش"
          title="یک تجربه، سه دیدگاه"
          className="mb-11"
        />

        <div className="mb-10 flex justify-center">
          <div className="inline-flex gap-1.5 rounded-[14px] border border-[var(--sk-border-strong)] bg-[var(--sk-bg)] p-1.5">
            {roles.map((role) => {
              const isActive = role.key === activeKey;
              return (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => setActiveKey(role.key)}
                  className={cn(
                    "flex h-[42px] items-center gap-[7px] rounded-[10px] px-5 text-[14.5px] font-semibold transition-colors",
                    isActive
                      ? "bg-[linear-gradient(180deg,var(--sk-gold-light),var(--sk-gold))] text-[var(--sk-bg)]"
                      : "text-[var(--sk-text-muted)] hover:text-[var(--sk-text)]",
                  )}
                >
                  <LandingIcon name={role.icon} className="size-[19px]" />
                  {role.label}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="grid grid-cols-2 items-center gap-10 max-[900px]:grid-cols-1"
          >
            <div>
              <h3 className="mb-2.5 text-[26px] font-extrabold">
                {active.title}
              </h3>
              <p className="mb-[26px] text-[15.5px] leading-[2] text-[var(--sk-text-muted)]">
                {active.description}
              </p>
              <div className="flex flex-col gap-3.5">
                {active.points.map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    <div className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-[color-mix(in_srgb,var(--sk-gold)_14%,transparent)] text-[var(--sk-gold)]">
                      <Check className="size-[18px]" />
                    </div>
                    <span className="text-[15px]">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] border border-[var(--sk-border-strong)] bg-[linear-gradient(135deg,#141c2e,var(--sk-surface-deep))] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
              <div className="mb-[22px] flex size-16 items-center justify-center rounded-[18px] bg-[color-mix(in_srgb,var(--sk-gold)_14%,transparent)] text-[var(--sk-gold)]">
                <LandingIcon name={active.icon} className="size-[34px]" />
              </div>
              <div className="text-[15px] leading-[2.1] text-[var(--sk-text-muted)]">
                {active.quote}
              </div>
              <div className="mt-[22px] flex items-center gap-3 border-t border-[var(--sk-border-strong)] pt-5">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#1e2636] font-bold text-[var(--sk-gold-light)]">
                  {active.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold">{active.author}</div>
                  <div className="text-[12.5px] text-[var(--sk-text-faint)]">
                    {active.authorRole}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
