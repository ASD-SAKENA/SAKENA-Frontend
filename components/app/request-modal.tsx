"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import {
  useCreateRequestMutation,
  useRequestCategoriesQuery,
  useUpdateRequestMutation,
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

const EMPTY: RequestForm = {
  categoryGroup: "FACILITIES",
  subCategory: "",
  title: "",
  description: "",
  location: "",
};

export function RequestModal() {
  const open = useAppUiStore((s) => s.requestModalOpen);
  const close = useAppUiStore((s) => s.closeRequestModal);
  const editingRequest = useAppUiStore((s) => s.editingRequest);
  const createRequest = useCreateRequestMutation();
  const updateRequest = useUpdateRequestMutation();
  const { data: categoryData } = useRequestCategoriesQuery();
  const pending = createRequest.isPending || updateRequest.isPending;

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: EMPTY,
    values: editingRequest
      ? {
          categoryGroup: editingRequest.categoryGroup,
          subCategory: editingRequest.subCategory,
          title: editingRequest.title,
          description: editingRequest.description,
          location: editingRequest.location ?? "",
        }
      : EMPTY,
  });

  const groups = categoryData?.categories ?? [];
  const selectedGroup = useWatch({ control, name: "categoryGroup" });
  const subCategories =
    groups.find((g) => g.value === selectedGroup)?.subCategories ?? [];

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      categoryGroup: values.categoryGroup as ServiceCategoryGroup,
      subCategory: values.subCategory,
      title: values.title,
      description: values.description,
      location: values.location?.trim() ? values.location.trim() : undefined,
    };
    try {
      if (editingRequest) {
        await updateRequest.mutateAsync({ id: editingRequest.id, payload });
        toast.success("درخواست شما ویرایش شد");
      } else {
        await createRequest.mutateAsync(payload);
        toast.success("درخواست شما ثبت شد و در صف بررسی قرار گرفت");
      }
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
      title={editingRequest ? "ویرایش درخواست خدماتی" : "ثبت درخواست خدماتی"}
      description={
        editingRequest
          ? "فقط درخواست‌های در وضعیت «باز» قابل ویرایش هستند."
          : "درخواست شما پس از ثبت توسط مدیر بررسی و به کارکن ارجاع می‌شود."
      }
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

        <AppField
          label="جزئیات مکان (اختیاری)"
          error={errors.location?.message}
        >
          <AppInput
            placeholder="مثلاً راه‌پله طبقه ۳ یا پارکینگ"
            {...register("location")}
          />
        </AppField>

        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="submit"
            disabled={pending}
            className="h-[46px] flex-1"
          >
            {editingRequest ? "ذخیره تغییرات" : "ثبت درخواست"}
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
