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

import { useCompleteRequestMutation } from "@/queries/requests";

import {
  type CompleteTaskForm,
  completeTaskSchema,
} from "@/schemas/request.schema";

import type { StaffTask } from "@/types/tasks.type";

interface Props {
  task: StaffTask | null;
  onClose: () => void;
}

export function CompleteTaskModal({ task, onClose }: Props) {
  const completeRequest = useCompleteRequestMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompleteTaskForm>({
    resolver: zodResolver(completeTaskSchema),
    defaultValues: { completionReport: "", completionCost: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!task) return;
    try {
      await completeRequest.mutateAsync({
        id: task.id,
        report: values.completionReport || undefined,
        cost: values.completionCost ? Number(values.completionCost) : undefined,
      });
      toast.success(`گزارش انجام کار «${task.title}» ثبت شد`);
      reset();
      onClose();
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  });

  return (
    <Modal
      open={task !== null}
      onClose={onClose}
      title="ثبت انجام کار"
      description={task ? `گزارش پایان کار «${task.title}»` : undefined}
      icon="task_alt"
    >
      <form onSubmit={onSubmit} className="mt-4">
        <AppField
          label="گزارش انجام (اختیاری)"
          error={errors.completionReport?.message}
        >
          <AppTextarea
            placeholder="شرح کار انجام‌شده…"
            {...register("completionReport")}
          />
        </AppField>

        <AppField
          label="هزینه (تومان — اختیاری)"
          error={errors.completionCost?.message}
        >
          <AppInput
            dir="ltr"
            inputMode="numeric"
            placeholder="مثلاً 250000"
            {...register("completionCost")}
          />
        </AppField>

        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="submit"
            disabled={completeRequest.isPending}
            className="h-[46px] flex-1"
          >
            ثبت انجام
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
