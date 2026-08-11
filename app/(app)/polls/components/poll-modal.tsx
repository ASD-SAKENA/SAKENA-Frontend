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

import { useCreatePollMutation } from "@/queries/polls";

import { type PollForm, pollSchema, splitOptions } from "@/schemas/poll.schema";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function PollModal({ open, onClose }: Props) {
  const createPoll = useCreatePollMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PollForm>({
    resolver: zodResolver(pollSchema),
    defaultValues: { question: "", options: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createPoll.mutateAsync({
        question: values.question,
        options: splitOptions(values.options),
      });
      toast.success("نظرسنجی ایجاد شد و برای ساکنین نمایش داده می‌شود");
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
      title="ایجاد نظرسنجی"
      description="نظرسنجی در پنل تمام ساکنین نمایش داده می‌شود و هر واحد یک بار رأی می‌دهد."
    >
      <form onSubmit={onSubmit} className="mt-4">
        <AppField label="سؤال نظرسنجی" error={errors.question?.message}>
          <AppInput
            placeholder="مثلاً تعویض موکت لابی را تأیید می‌کنید؟"
            {...register("question")}
          />
        </AppField>

        <AppField
          label="گزینه‌ها (هر گزینه در یک خط)"
          error={errors.options?.message}
        >
          <AppTextarea placeholder={"بله\nخیر"} {...register("options")} />
        </AppField>

        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="submit"
            disabled={createPoll.isPending}
            className="h-[46px] flex-1"
          >
            ایجاد نظرسنجی
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
