"use client";

import { useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppIcon } from "@/components/app/app-icon";

import {
  useReplyToTicketMutation,
  useSendTicketAttachmentMutation,
} from "@/queries/support";

import { useVoiceRecorder } from "@/hooks/use-voice-recorder";

import { formatDuration } from "@/lib/chat";
import { cn } from "@/lib/utils";

import {
  type TicketReplyForm,
  ticketReplySchema,
} from "@/schemas/support.schema";

interface Props {
  ticketId: string;
  /** An answered ticket still accepts a reply — it reopens the conversation. */
  hint?: string;
}

const ICON_BUTTON =
  "flex size-[42px] shrink-0 items-center justify-center rounded-xl border border-app-border bg-app-surface text-app-muted transition-colors hover:border-app-gold hover:text-app-gold disabled:cursor-not-allowed disabled:opacity-50";

export function TicketComposer({ ticketId, hint }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reply = useReplyToTicketMutation();
  const sendAttachment = useSendTicketAttachmentMutation();
  const recorder = useVoiceRecorder();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketReplyForm>({
    resolver: zodResolver(ticketReplySchema),
    defaultValues: { body: "" },
  });

  const busy = reply.isPending || sendAttachment.isPending;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await reply.mutateAsync({
        ticketId,
        payload: { body: values.body, kind: "TEXT" },
      });
      reset();
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  });

  const handleImageSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    // Clear immediately so picking the same file twice still fires a change.
    event.target.value = "";
    if (!file) return;
    try {
      await sendAttachment.mutateAsync({ ticketId, kind: "IMAGE", file });
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  };

  const handleStartRecording = async () => {
    try {
      await recorder.start();
    } catch {
      toast.error("دسترسی به میکروفون امکان‌پذیر نیست");
    }
  };

  const handleStopRecording = async () => {
    const clip = await recorder.stop();
    if (!clip) return;
    try {
      await sendAttachment.mutateAsync({
        ticketId,
        kind: "VOICE",
        file: clip.file,
        durationSeconds: clip.durationSeconds,
      });
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  };

  if (recorder.recording) {
    return (
      <div className="flex items-center gap-2.5 border-t border-app-border bg-app-surface px-4 py-3">
        <span className="flex size-2.5 animate-pulse rounded-full bg-app-danger" />
        <span className="text-[13px] font-semibold text-app-fg">
          در حال ضبط پیام صوتی · {formatDuration(recorder.elapsed)}
        </span>
        <span className="flex-1" />
        <button
          type="button"
          onClick={recorder.cancel}
          className="h-[38px] rounded-xl border border-app-border px-3.5 text-[13px] font-semibold text-app-muted transition-colors hover:border-app-danger hover:text-app-danger"
        >
          انصراف
        </button>
        <button
          type="button"
          onClick={handleStopRecording}
          className="flex h-[38px] items-center gap-1.5 rounded-xl bg-app-gold px-3.5 text-[13px] font-bold text-app-gold-fg transition-[filter] hover:brightness-105"
        >
          <AppIcon name="send" className="size-[17px]" />
          ارسال
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-app-border bg-app-surface px-4 py-3"
    >
      {hint ? <p className="mb-2 text-[12px] text-app-muted">{hint}</p> : null}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={busy}
          aria-label="ارسال تصویر"
          className={ICON_BUTTON}
        >
          <AppIcon name="image" className="size-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleImageSelected}
          className="hidden"
        />

        <button
          type="button"
          onClick={handleStartRecording}
          disabled={busy}
          aria-label="ضبط پیام صوتی"
          className={ICON_BUTTON}
        >
          <AppIcon name="mic" className="size-5" />
        </button>

        <input
          {...register("body")}
          placeholder="پاسخ خود را بنویسید…"
          className={cn(
            "h-[42px] flex-1 rounded-xl border border-app-border bg-app-bg px-3.5 text-right text-[13.5px] text-app-fg transition-[border-color,box-shadow] outline-none placeholder:text-app-muted",
            "focus:border-app-gold focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--ap-gold)_22%,transparent)]",
          )}
        />

        <button
          type="submit"
          disabled={busy}
          aria-label="ارسال پاسخ"
          className="flex size-[42px] shrink-0 items-center justify-center rounded-xl bg-app-gold text-app-gold-fg transition-[filter] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <AppIcon name="send" className="size-5" />
        </button>
      </div>
      {errors.body ? (
        <p className="mt-1.5 text-[12px] text-app-danger">
          {errors.body.message}
        </p>
      ) : null}
    </form>
  );
}
