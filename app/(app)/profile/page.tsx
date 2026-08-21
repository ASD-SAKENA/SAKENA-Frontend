"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { Avatar } from "@/components/app/avatar";
import { AppField, AppInput } from "@/components/app/form-controls";
import { SectionCard } from "@/components/app/section-card";

import { useProfileQuery, useUpdateProfileMutation } from "@/queries/profile";
import { useMyResidencyQuery } from "@/queries/residency";

import { useAuthStore } from "@/stores/auth.store";

import { toFaDigits } from "@/lib/persian-number";

import { type ProfileForm, profileSchema } from "@/schemas/profile.schema";
import { TENANCY_LABELS } from "@/schemas/residency.schema";

import { AvatarPicker } from "./components/avatar-picker";
import { ChangePasswordCard } from "./components/change-password-card";

const EMPTY: ProfileForm = { name: "", email: "", unit: "" };

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const { data: residency } = useMyResidencyQuery();

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
    try {
      await updateProfile.mutateAsync(values);
      toast.success("تغییرات ذخیره شد");
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  });

  return (
    <div className="sk-page">
      <SectionCard className="mx-auto max-w-[620px]" bodyClassName="p-[26px]">
        <div className="mb-6 flex items-center gap-[18px]">
          <Avatar
            src={user?.avatarUrl}
            initial={user?.initial ?? "س"}
            size={70}
          />
          <div>
            <div className="text-[19px] font-bold text-app-fg">
              {user?.name}
            </div>
            <div className="mt-[3px] text-[13px] text-app-muted">
              {user?.roleLabel}
              {residency ? ` · ${TENANCY_LABELS[residency.tenancy]}` : null}
            </div>
          </div>
        </div>

        <div className="mb-6 border-y border-app-border py-5">
          <div className="mb-3 text-[13px] font-medium text-app-fg">
            تصویر پروفایل
          </div>
          <AvatarPicker />
          <p className="mt-2.5 text-[12px] text-app-muted">
            اگر تصویری انتخاب نکنید، حرف اول نام شما نمایش داده می‌شود.
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <AppField label="نام و نام خانوادگی" error={errors.name?.message}>
            <AppInput {...register("name")} />
          </AppField>

          <AppField label="ایمیل" error={errors.email?.message}>
            <AppInput {...register("email")} />
          </AppField>

          <AppField label="واحد">
            <AppInput
              readOnly
              value={
                residency
                  ? [
                      residency.unitNumber
                        ? `واحد ${residency.unitNumber}`
                        : null,
                      residency.buildingName,
                    ]
                      .filter(Boolean)
                      .join(" — ")
                  : "واحدی به شما تخصیص داده نشده است"
              }
            />
          </AppField>

          {residency &&
          (residency.floorNumber !== null ||
            residency.areaSquareMeters !== null ||
            residency.bedrooms !== null) ? (
            <div className="mb-4 grid grid-cols-3 gap-2.5">
              {residency.floorNumber !== null ? (
                <div className="rounded-xl border border-app-border bg-app-surface2 p-3 text-center">
                  <div className="text-[16px] font-extrabold text-app-fg">
                    {toFaDigits(residency.floorNumber)}
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-app-muted">
                    طبقه
                  </div>
                </div>
              ) : null}
              {residency.areaSquareMeters !== null ? (
                <div className="rounded-xl border border-app-border bg-app-surface2 p-3 text-center">
                  <div className="text-[16px] font-extrabold text-app-fg">
                    {toFaDigits(residency.areaSquareMeters)}
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-app-muted">
                    متراژ (متر)
                  </div>
                </div>
              ) : null}
              {residency.bedrooms !== null ? (
                <div className="rounded-xl border border-app-border bg-app-surface2 p-3 text-center">
                  <div className="text-[16px] font-extrabold text-app-fg">
                    {toFaDigits(residency.bedrooms)}
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-app-muted">
                    تعداد اتاق
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <AppButton
            type="submit"
            disabled={updateProfile.isPending}
            className="mt-1.5 h-[46px] px-6"
          >
            ذخیره تغییرات
          </AppButton>
        </form>
      </SectionCard>

      <ChangePasswordCard />
    </div>
  );
}
