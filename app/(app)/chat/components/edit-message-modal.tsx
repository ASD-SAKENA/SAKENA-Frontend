"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppTextarea } from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";

import { useEditMessageMutation } from "@/queries/chat";

import { type ChatMessageForm, chatMessageSchema } from "@/schemas/chat.schema";

import type { ChatMessageApiResponse } from "@/types/chat.api.type";

interface Props {
  buildingId: string | null;
  message: ChatMessageApiResponse | null;
  onClose: () => void;
}

export function EditMessageModal({ buildingId, message, onClose }: Props) {
  const editMessage = useEditMessageMutation(buildingId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChatMessageForm>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: { body: "" },
    values: { body: message?.body ?? "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!message) return;
    try {
      await editMessage.mutateAsync({
        messageId: message.id,
        body: values.body,
      });
      toast.success("پیام ویرایش شد");
      onClose();
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  });

  return (
    <Modal
      open={message !== null}
      onClose={onClose}
      title="ویرایش پیام"
      description="پس از ویرایش، برچسب «ویرایش‌شده» کنار پیام نمایش داده می‌شود."
    >
      <form onSubmit={onSubmit} className="mt-4">
        <AppField label="متن پیام" error={errors.body?.message}>
          <AppTextarea {...register("body")} />
        </AppField>

        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="submit"
            disabled={editMessage.isPending}
            className="h-[46px] flex-1"
          >
            ذخیره تغییرات
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
