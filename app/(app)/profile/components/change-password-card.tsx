"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppInput } from "@/components/app/form-controls";
import { SectionCard } from "@/components/app/section-card";

import { useChangePasswordMutation } from "@/queries/profile";

import {
  type ChangePasswordForm,
  changePasswordSchema,
} from "@/schemas/profile.schema";

export function ChangePasswordCard() {
  const changePassword = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await changePassword.mutateAsync(values);
      toast.success("رمز عبور با موفقیت تغییر کرد");
      reset();
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  });

  return (
    <SectionCard
      title="تغییر رمز عبور"
      className="mx-auto mt-4 max-w-[620px]"
      bodyClassName="p-[26px]"
    >
      <form onSubmit={onSubmit}>
        <AppField label="رمز عبور فعلی" error={errors.currentPassword?.message}>
          <AppInput
            type="password"
            dir="ltr"
            icon="lock"
            {...register("currentPassword")}
          />
        </AppField>

        <AppField label="رمز عبور جدید" error={errors.newPassword?.message}>
          <AppInput
            type="password"
            dir="ltr"
            placeholder="حداقل ۸ کاراکتر"
            icon="lock_reset"
            {...register("newPassword")}
          />
        </AppField>

        <AppButton
          type="submit"
          disabled={changePassword.isPending}
          className="mt-1.5 h-[46px] px-6"
        >
          تغییر رمز
        </AppButton>
      </form>
    </SectionCard>
  );
}
