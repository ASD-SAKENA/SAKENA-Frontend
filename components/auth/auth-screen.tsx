"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { BrandSide } from "./brand-side";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

type Mode = "login" | "signup";

interface Props {
  defaultMode: Mode;
}

export function AuthScreen({ defaultMode }: Props) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const isLogin = mode === "login";

  return (
    <div
      dir="rtl"
      className="grid min-h-screen grid-cols-[1.02fr_1fr] bg-[var(--sk-bg)] text-[var(--sk-text)] max-[880px]:grid-cols-1"
    >
      <BrandSide />

      <div className="sk-scroll flex items-center justify-center overflow-y-auto bg-[#0B101C] px-7 py-9">
        <div className="w-full max-w-[408px]">
          <div className="mb-[26px] grid grid-cols-2 gap-[5px] rounded-[13px] border border-[#222C40] bg-[#101626] p-[5px]">
            <TabButton
              active={isLogin}
              label="ورود"
              onClick={() => setMode("login")}
            />
            <TabButton
              active={!isLogin}
              label="ثبت‌نام"
              onClick={() => setMode("signup")}
            />
          </div>

          {isLogin ? <LoginForm /> : <SignupForm />}

          <p className="mt-5 text-center text-[13px] text-[var(--sk-text-muted)]">
            {isLogin ? "حساب ندارید؟ " : "قبلاً ثبت‌نام کرده‌اید؟ "}
            <button
              type="button"
              onClick={() => setMode(isLogin ? "signup" : "login")}
              className="cursor-pointer font-semibold text-[var(--sk-gold)]"
            >
              {isLogin ? "ثبت‌نام کنید" : "وارد شوید"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  label: string;
  onClick: () => void;
}

function TabButton({ active, label, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-[42px] rounded-[9px] text-[14.5px] font-semibold transition-all",
        active
          ? "bg-[linear-gradient(180deg,var(--sk-gold-light),var(--sk-gold))] text-[var(--sk-bg)] shadow-[0_4px_12px_rgba(201,162,78,.25)]"
          : "bg-transparent text-[var(--sk-text-muted)]",
      )}
    >
      {label}
    </button>
  );
}
