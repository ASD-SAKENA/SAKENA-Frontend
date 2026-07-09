"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppInput } from "@/components/app/form-controls";
import { SectionCard } from "@/components/app/section-card";

import { useResetPasswordMutation } from "@/queries/auth";

import {
  type ResetPasswordForm as ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/schemas/auth.schema";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const resetPassword = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await resetPassword.mutateAsync({
        token,
        newPassword: values.newPassword,
      });
      toast.success("رمز عبور با موفقیت تغییر کرد. اکنون وارد شوید.");
      router.push("/login");
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  });

  return (
    <div className="flex min-h-dvh items-center justify-center bg-app-bg p-4">
      <SectionCard className="w-full max-w-[440px]" bodyClassName="p-[26px]">
        <h1 className="mb-1.5 text-[22px] font-bold text-app-fg">
          تعیین رمز عبور جدید
        </h1>
        <p className="mb-6 text-[13.5px] text-app-muted">
          رمز عبور جدید حساب خود را وارد کنید.
        </p>

        {token ? (
          <form onSubmit={onSubmit}>
            <AppField label="رمز عبور جدید" error={errors.newPassword?.message}>
              <AppInput
                type="password"
                dir="ltr"
                placeholder="حداقل ۸ کاراکتر"
                icon="lock"
                {...register("newPassword")}
              />
            </AppField>

            <AppField
              label="تکرار رمز عبور"
              error={errors.confirmPassword?.message}
            >
              <AppInput
                type="password"
                dir="ltr"
                placeholder="••••••••"
                icon="lock"
                {...register("confirmPassword")}
              />
            </AppField>

            <AppButton
              type="submit"
              disabled={resetPassword.isPending}
              className="mt-1.5 h-[46px] w-full"
            >
              تغییر رمز عبور
            </AppButton>
          </form>
        ) : (
          <p className="text-[13.5px] text-app-danger">
            لینک بازیابی نامعتبر است. از صفحه ورود دوباره درخواست بازیابی دهید.
          </p>
        )}

        <div className="mt-5 text-center text-[13px] text-app-muted">
          <Link href="/login" className="font-medium text-app-gold">
            بازگشت به صفحه ورود
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}
