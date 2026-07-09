"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import {
  useCreateRequestMutation,
  useRequestCategoriesQuery,
} from "@/queries/requests";

import { useAppUiStore } from "@/stores/app-ui.store";

import { CATEGORY_GROUP_ICONS } from "@/lib/service-requests";
import { cn } from "@/lib/utils";

import { type RequestForm, requestSchema } from "@/schemas/request.schema";

import type { ServiceCategoryGroup } from "@/types/requests.api.type";

import { AppButton } from "./app-button";
import { AppIcon } from "./app-icon";
import { AppField, AppInput, AppSelect, AppTextarea } from "./form-controls";
import { Modal } from "./modal";

function groupIcon(value: string): string {
  return CATEGORY_GROUP_ICONS[value as ServiceCategoryGroup] ?? "handyman";
}

export function RequestModal() {
  const open = useAppUiStore((s) => s.requestModalOpen);
  const close = useAppUiStore((s) => s.closeRequestModal);
  const createRequest = useCreateRequestMutation();
  const { data: categoryData } = useRequestCategoriesQuery();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      categoryGroup: "FACILITIES",
      subCategory: "",
      title: "",
      description: "",
    },
  });

  const groups = categoryData?.categories ?? [];
  const selectedGroup = useWatch({ control, name: "categoryGroup" });
  const subCategories =
    groups.find((g) => g.value === selectedGroup)?.subCategories ?? [];

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createRequest.mutateAsync({
        categoryGroup: values.categoryGroup as ServiceCategoryGroup,
        subCategory: values.subCategory,
        title: values.title,
        description: values.description,
      });
      toast.success("درخواست شما ثبت شد و در صف بررسی قرار گرفت");
      reset();
      close();
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  });

  return (
    <Modal
      open={open}
      onClose={close}
      title="ثبت درخواست خدماتی"
      description="درخواست شما پس از ثبت توسط مدیر بررسی و به کارکن ارجاع می‌شود."
    >
      <form onSubmit={onSubmit} className="mt-4">
        <AppField label="دسته" error={errors.categoryGroup?.message}>
          <Controller
            control={control}
            name="categoryGroup"
            render={({ field }) => (
              <div className="grid grid-cols-4 gap-2 max-[420px]:grid-cols-3">
                {groups.map((group) => {
                  const active = field.value === group.value;
                  return (
                    <button
                      key={group.value}
                      type="button"
                      onClick={() => {
                        field.onChange(group.value);
                        setValue("subCategory", "");
                      }}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-[11px] border p-2.5 transition-colors",
                        active
                          ? "border-app-gold bg-[var(--ap-gold-soft)] text-app-gold"
                          : "border-app-border bg-app-surface2 text-app-muted",
                      )}
                    >
                      <AppIcon
                        name={groupIcon(group.value)}
                        className="size-5"
                      />
                      <span className="text-[11.5px] font-semibold">
                        {group.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          />
        </AppField>

        <AppField label="زیر‌دسته" error={errors.subCategory?.message}>
          <AppSelect {...register("subCategory")}>
            <option value="">انتخاب کنید…</option>
            {subCategories.map((sub) => (
              <option key={sub.value} value={sub.value}>
                {sub.label}
              </option>
            ))}
          </AppSelect>
        </AppField>

        <AppField label="عنوان درخواست" error={errors.title?.message}>
          <AppInput
            placeholder="مثلاً نشتی شیر آب آشپزخانه"
            {...register("title")}
          />
        </AppField>

        <AppField label="شرح مشکل" error={errors.description?.message}>
          <AppTextarea
            placeholder="توضیح مختصری درباره مشکل بنویسید…"
            {...register("description")}
          />
        </AppField>

        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="submit"
            disabled={createRequest.isPending}
            className="h-[46px] flex-1"
          >
            ثبت درخواست
          </AppButton>
          <AppButton
            type="button"
            variant="outline"
            onClick={close}
            className="h-[46px] px-6"
          >
            انصراف
          </AppButton>
        </div>
      </form>
    </Modal>
  );
}
