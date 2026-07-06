"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppInput } from "@/components/app/form-controls";
import { SectionCard } from "@/components/app/section-card";

import { useProfileQuery, useUpdateProfileMutation } from "@/queries/profile";

import { useAuthStore } from "@/stores/auth.store";

import { type ProfileForm, profileSchema } from "@/schemas/profile.schema";

const EMPTY: ProfileForm = { name: "", mobile: "", email: "", unit: "" };

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfileQuery();
  const updateProfile = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: EMPTY,
    values: profile,
  });

  const onSubmit = handleSubmit(async (values) => {
    await updateProfile.mutateAsync(values);
    toast.success("تغییرات ذخیره شد");
  });

  return (
    <div className="sk-page">
      <SectionCard className="mx-auto max-w-[620px]" bodyClassName="p-[26px]">
        <div className="mb-6 flex items-center gap-[18px]">
          <div className="flex size-[70px] items-center justify-center rounded-full bg-[var(--ap-gold-soft)] text-[26px] font-extrabold text-app-gold">
            {user?.initial}
          </div>
          <div>
            <div className="text-[19px] font-bold text-app-fg">
              {user?.name}
            </div>
            <div className="mt-[3px] text-[13px] text-app-muted">
              {user?.roleLabel} · واحد ۱۲
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <AppField label="نام و نام خانوادگی" error={errors.name?.message}>
            <AppInput {...register("name")} />
          </AppField>

          <AppField label="شماره موبایل" error={errors.mobile?.message}>
            <AppInput {...register("mobile")} />
          </AppField>

          <AppField label="ایمیل" error={errors.email?.message}>
            <AppInput {...register("email")} />
          </AppField>

          <AppField label="واحد" error={errors.unit?.message}>
            <AppInput {...register("unit")} />
          </AppField>

          <AppButton
            type="submit"
            disabled={updateProfile.isPending}
            className="mt-1.5 h-[46px] px-6"
          >
            ذخیره تغییرات
          </AppButton>
        </form>
      </SectionCard>
    </div>
  );
}
