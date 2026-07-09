"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppInput } from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";

import { useForgotPasswordMutation } from "@/queries/auth";

import {
  type ForgotPasswordForm,
  forgotPasswordSchema,
} from "@/schemas/auth.schema";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ open, onClose }: Props) {
  const forgotPassword = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await forgotPassword.mutateAsync(values.email);
      toast.success(
        "اگر حسابی با این ایمیل وجود داشته باشد، لینک بازیابی ارسال شد",
      );
      reset();
      onClose();
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="بازیابی رمز عبور"
      description="ایمیل حساب خود را وارد کنید تا لینک بازیابی برایتان ارسال شود."
      icon="lock_reset"
    >
      <form onSubmit={onSubmit} className="mt-4">
        <AppField label="ایمیل" error={errors.email?.message}>
          <AppInput
            dir="ltr"
            placeholder="example@mail.com"
            icon="mail"
            {...register("email")}
          />
        </AppField>
        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="submit"
            disabled={forgotPassword.isPending}
            className="h-[46px] flex-1"
          >
            ارسال لینک بازیابی
          </AppButton>
          <AppButton
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-[46px] px-6"
          >
            انصراف
          </AppButton>
        </div>
      </form>
    </Modal>
  );
}
