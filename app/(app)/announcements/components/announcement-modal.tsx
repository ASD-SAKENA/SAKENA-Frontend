"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import {
  AppField,
  AppInput,
  AppTextarea,
} from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";

import { useCreateAnnouncementMutation } from "@/queries/announcements";

import {
  type AnnouncementForm,
  announcementSchema,
} from "@/schemas/announcement.schema";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AnnouncementModal({ open, onClose }: Props) {
  const createAnnouncement = useCreateAnnouncementMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: "", body: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createAnnouncement.mutateAsync(values);
      toast.success("اطلاعیه منتشر شد");
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
      title="انتشار اطلاعیه جدید"
      description="اطلاعیه پس از انتشار در پنل همه ساکنین نمایش داده می‌شود."
    >
      <form onSubmit={onSubmit} className="mt-4">
        <AppField label="عنوان اطلاعیه" error={errors.title?.message}>
          <AppInput
            placeholder="مثلاً قطعی آب گرم — سرویس موتورخانه"
            {...register("title")}
          />
        </AppField>

        <AppField label="متن اطلاعیه" error={errors.body?.message}>
          <AppTextarea
            placeholder="متن کامل اطلاعیه را بنویسید…"
            {...register("body")}
          />
        </AppField>

        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="submit"
            disabled={createAnnouncement.isPending}
            className="h-[46px] flex-1"
          >
            انتشار اطلاعیه
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
