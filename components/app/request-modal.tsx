"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateRequestMutation } from "@/queries/requests";

import { useAppUiStore } from "@/stores/app-ui.store";

import { cn } from "@/lib/utils";

import { type RequestForm, requestSchema } from "@/schemas/request.schema";

import { AppButton } from "./app-button";
import { AppIcon } from "./app-icon";
import { AppField, AppTextarea } from "./form-controls";
import { Modal } from "./modal";

const REQ_TYPE_OPTIONS = [
  { value: "تأسیسات", icon: "plumbing" },
  { value: "برق", icon: "bolt" },
  { value: "نظافت", icon: "cleaning_services" },
] as const;

export function RequestModal() {
  const open = useAppUiStore((s) => s.requestModalOpen);
  const close = useAppUiStore((s) => s.closeRequestModal);
  const createRequest = useCreateRequestMutation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: { type: "تأسیسات", description: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    await createRequest.mutateAsync(values);
    toast.success("درخواست شما ثبت شد و در صف بررسی قرار گرفت");
    reset();
    close();
  });

  return (
    <Modal
      open={open}
      onClose={close}
      title="ثبت درخواست خدماتی"
      description="درخواست شما پس از ثبت توسط مدیر بررسی و به کارکن ارجاع می‌شود."
    >
      <form onSubmit={onSubmit} className="mt-4">
        <AppField label="نوع درخواست">
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-2">
                {REQ_TYPE_OPTIONS.map((opt) => {
                  const active = field.value === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => field.onChange(opt.value)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-[11px] border p-[13px] transition-colors",
                        active
                          ? "border-app-gold bg-[var(--ap-gold-soft)] text-app-gold"
                          : "border-app-border bg-app-surface2 text-app-muted",
                      )}
                    >
                      <AppIcon name={opt.icon} className="size-5" />
                      <span className="text-[12.5px] font-semibold">
                        {opt.value}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
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
