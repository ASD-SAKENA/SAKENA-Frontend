"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { AppInput } from "@/components/app/form-controls";

import { extractInviteToken } from "@/lib/invite-token";

/**
 * Shown instead of resident-only content while the signed-in resident has no
 * active residency (i.e. is not yet in a building).
 */
export function NoUnitNotice() {
  const router = useRouter();
  const [inviteInput, setInviteInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleJoin = () => {
    const token = extractInviteToken(inviteInput);
    if (!token) {
      setError("لینک یا کد دعوت معتبر وارد کنید.");
      return;
    }
    setError(null);
    router.push(`/join?token=${encodeURIComponent(token)}`);
  };

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-app-border bg-app-surface px-6 py-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-app-surface2 text-app-muted">
        <AppIcon name="apartment" className="size-7" />
      </div>
      <div className="text-[15px] font-bold text-app-fg">
        عضو هیچ ساختمانی نیستید
      </div>
      <p className="max-w-[400px] text-[13px] leading-7 text-app-muted">
        برای استفاده از داشبورد و بخش‌های ساختمان، باید با لینک دعوتی که مدیر
        برایتان می‌فرستد عضو ساختمان شوید.
      </p>

      <div className="mt-2 w-full max-w-[400px] text-right">
        <label className="mb-1.5 block text-[12.5px] font-medium text-app-muted">
          لینک یا کد دعوت
        </label>
        <AppInput
          value={inviteInput}
          onChange={(event) => {
            setInviteInput(event.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleJoin();
            }
          }}
          placeholder="مثلاً لینک /join?token=… را اینجا بچسبانید"
        />
        {error ? (
          <p className="mt-1.5 text-[12px] text-app-danger">{error}</p>
        ) : null}
        <AppButton
          variant="gold"
          className="mt-3 h-[42px] w-full"
          onClick={handleJoin}
        >
          عضویت با لینک دعوت
        </AppButton>
      </div>
    </div>
  );
}
