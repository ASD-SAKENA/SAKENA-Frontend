"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";

import {
  useAcceptInvitationMutation,
  useInvitationPreviewQuery,
} from "@/queries/invitations";

import { useAuthStore } from "@/stores/auth.store";

import { roleHomePath } from "@/lib/app-nav";
import { formatFaDate } from "@/lib/format-date";

import { INVITATION_CHANNEL_LABELS } from "@/schemas/invitation.schema";

const ROLE_LABELS = {
  RESIDENT: "ساکن",
  MANAGER: "مدیر ساختمان",
  STAFF: "کارکن خدماتی",
  ADMIN: "مدیر سامانه",
} as const;

const CARD =
  "w-full max-w-[460px] rounded-2xl border border-app-border bg-app-surface p-7 shadow-[var(--ap-shadow)]";

export function JoinScreen() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const {
    data: invitation,
    isPending,
    isError,
  } = useInvitationPreviewQuery(token);
  const acceptInvitation = useAcceptInvitationMutation();

  const handleAccept = () => {
    if (!token) return;
    acceptInvitation.mutate(token, {
      onSuccess: () => {
        toast.success("به ساختمان خوش آمدید!");
        router.push(user ? roleHomePath(user.role) : "/dashboard");
      },
    });
  };

  // The invitee usually arrives from an email before ever signing in; send
  // them through auth and back to this same link.
  const handleSignIn = () => {
    const next = encodeURIComponent(`/join?token=${token ?? ""}`);
    router.push(`/login?next=${next}`);
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-app-bg p-5">
      {!token || isError ? (
        <div className={CARD}>
          <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--ap-danger)_14%,transparent)]">
            <AppIcon name="error" className="size-6 text-app-danger" />
          </div>
          <h1 className="mb-1.5 text-[19px] font-bold text-app-fg">
            این لینک دعوت معتبر نیست
          </h1>
          <p className="text-[13.5px] leading-[1.9] text-app-muted">
            ممکن است لینک منقضی شده، لغو شده یا قبلاً استفاده شده باشد. از مدیر
            ساختمان بخواهید دعوت تازه‌ای برایتان بفرستد.
          </p>
        </div>
      ) : isPending ? (
        <div className={CARD}>
          <p className="text-[13.5px] text-app-muted">
            در حال بررسی دعوت‌نامه…
          </p>
        </div>
      ) : (
        <div className={CARD}>
          <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[var(--ap-gold-soft)]">
            <AppIcon name="apartment" className="size-6 text-app-gold" />
          </div>

          <h1 className="mb-1.5 text-[20px] font-bold text-app-fg">
            دعوت به «{invitation.buildingName}»
          </h1>
          <p className="mb-5 text-[13.5px] leading-[1.9] text-app-muted">
            شما به‌عنوان <b>{ROLE_LABELS[invitation.role]}</b> به این ساختمان
            دعوت شده‌اید
            {invitation.unitNumber ? (
              <>
                {" "}
                و پس از پذیرش، واحد <b>{invitation.unitNumber}</b> به شما تخصیص
                داده می‌شود
              </>
            ) : null}
            .
          </p>

          <dl className="mb-6 flex flex-col gap-2 rounded-xl bg-app-surface2 px-4 py-3 text-[12.5px]">
            <div className="flex justify-between">
              <dt className="text-app-muted">روش دعوت</dt>
              <dd className="text-app-fg">
                {INVITATION_CHANNEL_LABELS[invitation.channel]}
              </dd>
            </div>
            {invitation.recipientHint ? (
              <div className="flex justify-between">
                <dt className="text-app-muted">فرستاده‌شده به</dt>
                <dd dir="ltr" className="text-app-fg">
                  {invitation.recipientHint}
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-app-muted">اعتبار تا</dt>
              <dd className="text-app-fg">
                {formatFaDate(invitation.expiresAt)}
              </dd>
            </div>
          </dl>

          {isAuthenticated ? (
            <AppButton
              variant="gold"
              onClick={handleAccept}
              disabled={acceptInvitation.isPending}
              className="h-[46px] w-full"
            >
              پذیرش دعوت و پیوستن
            </AppButton>
          ) : (
            <>
              <AppButton
                variant="gold"
                onClick={handleSignIn}
                className="h-[46px] w-full"
              >
                ورود یا ثبت‌نام برای پیوستن
              </AppButton>
              <p className="mt-3 text-center text-[12px] text-app-muted">
                پس از ورود، به همین صفحه بازمی‌گردید.
              </p>
            </>
          )}
        </div>
      )}
    </main>
  );
}
