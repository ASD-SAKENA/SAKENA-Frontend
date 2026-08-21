"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import {
  AppField,
  AppInput,
  AppTextarea,
} from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";

import { useOpenTicketMutation } from "@/queries/support";

import { TICKET_CATEGORIES, TICKET_CATEGORY_META } from "@/lib/support";
import { cn } from "@/lib/utils";

import {
  type OpenTicketForm,
  openTicketSchema,
} from "@/schemas/support.schema";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NewTicketModal({ open, onClose }: Props) {
  const openTicket = useOpenTicketMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OpenTicketForm>({
    resolver: zodResolver(openTicketSchema),
    defaultValues: {
      category: "COMPLAINT",
      subject: "",
      body: "",
      anonymous: false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await openTicket.mutateAsync(values);
      toast.success("تیکت شما ثبت شد");
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
      title="ثبت شکایت، انتقاد یا پیشنهاد"
      description="این گفتگو خصوصی است و فقط شما و مدیر ساختمان آن را می‌بینید."
      icon="support"
    >
      <form onSubmit={onSubmit} className="mt-4">
        <label className="mb-[9px] block text-[13px] font-medium">موضوع</label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <div className="mb-[18px] flex flex-wrap gap-2">
              {TICKET_CATEGORIES.map((category) => {
                const meta = TICKET_CATEGORY_META[category];
                const active = field.value === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => field.onChange(category)}
                    className={cn(
                      "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[10px] border text-[12.5px] font-semibold transition-[border-color,background,color]",
                      active
                        ? "border-app-gold bg-[var(--ap-gold-soft)] text-app-gold"
                        : "border-app-border bg-transparent text-app-fg hover:border-app-gold",
                    )}
                  >
                    <AppIcon name={meta.icon} className="size-[17px]" />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          )}
        />

        <AppField label="عنوان" error={errors.subject?.message}>
          <AppInput
            placeholder="مثلاً سر و صدای واحد بالا"
            {...register("subject")}
          />
        </AppField>

        <AppField label="شرح موضوع" error={errors.body?.message}>
          <AppTextarea
            placeholder="موضوع را کامل توضیح دهید…"
            {...register("body")}
          />
        </AppField>

        <Controller
          control={control}
          name="anonymous"
          render={({ field }) => (
            <label className="mb-[18px] flex cursor-pointer items-start gap-2.5 rounded-[11px] border border-app-border bg-app-surface2 px-[14px] py-[11px]">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
                className="mt-0.5 size-4 accent-[var(--ap-gold)]"
              />
              <span className="text-[12.5px] leading-[1.9] text-app-muted">
                ارسال ناشناس — مدیر ساختمان نام و واحد شما را نمی‌بیند. پاسخ‌ها
                همچنان به همین گفتگو می‌آید.
              </span>
            </label>
          )}
        />

        <div className="flex gap-2.5">
          <AppButton
            type="submit"
            disabled={openTicket.isPending}
            className="h-[46px] flex-1"
          >
            ثبت تیکت
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
