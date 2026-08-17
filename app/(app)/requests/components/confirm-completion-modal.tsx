"use client";

import { useState } from "react";

import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { Modal } from "@/components/app/modal";
import { StarRating } from "@/components/app/star-rating";

import { useConfirmCompletionMutation } from "@/queries/requests";

import type { ServiceRequest } from "@/types/requests.type";

interface Props {
  request: ServiceRequest | null;
  onClose: () => void;
}

export function ConfirmCompletionModal({ request, onClose }: Props) {
  const [score, setScore] = useState(0);
  const confirmCompletion = useConfirmCompletionMutation();

  const handleClose = () => {
    setScore(0);
    onClose();
  };

  const handleSubmit = () => {
    if (!request || score === 0) return;
    confirmCompletion.mutate(
      { id: request.id, score },
      {
        onSuccess: () => {
          toast.success("تایید شما ثبت شد");
          handleClose();
        },
      },
    );
  };

  return (
    <Modal
      open={request !== null}
      onClose={handleClose}
      title="تایید انجام کار"
      description={
        request
          ? `به کار انجام‌شده روی «${request.title}» امتیاز بدهید.`
          : undefined
      }
      icon="check_circle"
    >
      <div className="mt-4 flex flex-col items-center gap-4">
        <StarRating value={score} onChange={setScore} />
        <div className="flex w-full gap-2.5">
          <AppButton
            type="button"
            onClick={handleSubmit}
            disabled={score === 0 || confirmCompletion.isPending}
            className="h-[46px] flex-1"
          >
            ثبت تایید و امتیاز
          </AppButton>
          <AppButton
            type="button"
            variant="outline"
            onClick={handleClose}
            className="h-[46px] px-6"
          >
            انصراف
          </AppButton>
        </div>
      </div>
    </Modal>
  );
}
