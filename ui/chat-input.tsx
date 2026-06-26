"use client";

import * as React from "react";

import Image from "next/image";

import { ArrowUp, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { CameraCaptureDialog } from "@/components/image-attachment/camera-capture-dialog";
import { ImageCropDialog } from "@/components/image-attachment/image-crop-dialog";
import { ImageSourceSheet } from "@/components/image-attachment/image-source-sheet";

import { Button } from "@/ui/button";
import { Field } from "@/ui/field";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";

import { cn } from "@/lib/utils";

function showImageUploadNotAllowedToast() {
  toast.info("پکیج شما قابلیت آپلود عکس ندارد.", {
    description: "پکیج خود را ارتقا دهید.",
  });
}

interface ChatInputProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange"
> {
  onSend?: (message: string, image?: File | null) => void;
  isLoading?: boolean;
  enableImageUpload?: boolean;
  showGlow?: boolean;
  /** Filled by onboarding tour once when set (e.g. example question to send). */
  tourInitialText?: string | null;
  /** One-shot image prefill (e.g. restored landing draft). Applied once when set. */
  initialImage?: File | null;
  /** e.g. `chat-composer-input` — set on the textarea for driver.js. */
  tourInputDataTour?: string;
  /** e.g. `chat-composer-send` — set on the send control for driver.js. */
  tourSendDataTour?: string;
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  (
    {
      className,
      onSend,
      isLoading = false,
      disabled,
      enableImageUpload = true,
      showGlow = false,
      tourInitialText = null,
      initialImage = null,
      tourInputDataTour,
      tourSendDataTour,
      onPaste,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = React.useState("");
    const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
    const [pendingFile, setPendingFile] = React.useState<File | null>(null);
    const [sourceSheetOpen, setSourceSheetOpen] = React.useState(false);
    const [cameraOpen, setCameraOpen] = React.useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const galleryInputRef = React.useRef<HTMLInputElement>(null);

    const resetFileInputs = () => {
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    };
    const previewUrl = React.useMemo(
      () => (selectedImage ? URL.createObjectURL(selectedImage) : null),
      [selectedImage],
    );

    React.useEffect(() => {
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    }, [previewUrl]);

    React.useImperativeHandle(
      ref,
      () => textareaRef.current as HTMLTextAreaElement,
    );

    React.useEffect(() => {
      if (!enableImageUpload && (selectedImage || pendingFile)) {
        setSelectedImage(null);
        setPendingFile(null);
        resetFileInputs();
      }
    }, [enableImageUpload, selectedImage, pendingFile]);

    const prevTourInitial = React.useRef<string | null>(null);
    /* useLayoutEffect: prefill is visible in the same frame as the driver highlight. */
    React.useLayoutEffect(() => {
      if (tourInitialText == null || tourInitialText === "") {
        if (tourInitialText == null) prevTourInitial.current = null;
        return;
      }
      if (prevTourInitial.current === tourInitialText) return;
      prevTourInitial.current = tourInitialText;
      setValue(tourInitialText);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
        textareaRef.current.style.height = `${newHeight}px`;
      }
    }, [tourInitialText]);

    const prevInitialImage = React.useRef<File | null>(null);
    React.useEffect(() => {
      if (!initialImage) {
        if (initialImage === null) prevInitialImage.current = null;
        return;
      }
      if (prevInitialImage.current === initialImage) return;
      prevInitialImage.current = initialImage;
      if (enableImageUpload) setSelectedImage(initialImage);
    }, [initialImage, enableImageUpload]);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = e.currentTarget;
      setValue(textarea.value);
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 120);
      textarea.style.height = `${newHeight}px`;
    };

    const handleSend = () => {
      if ((value.trim() || selectedImage) && !isLoading) {
        onSend?.(value.trim(), selectedImage);
        setValue("");
        setSelectedImage(null);
        resetFileInputs();
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    };

    const handleAttachClick = () => {
      if (!enableImageUpload) {
        showImageUploadNotAllowedToast();
        return;
      }
      setSourceSheetOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      if (file) setPendingFile(file);
    };

    const handleCropConfirm = (cropped: File) => {
      setSelectedImage(cropped);
      setPendingFile(null);
      resetFileInputs();
    };

    const handleCropCancel = () => {
      setPendingFile(null);
      resetFileInputs();
    };

    const handleRemoveImage = () => {
      setSelectedImage(null);
      resetFileInputs();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSend();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      onPaste?.(e);
      if (e.defaultPrevented) return;
      if (isLoading || disabled) return;

      const items = e.clipboardData?.items;
      if (!items || items.length === 0) return;

      const imageItem = Array.from(items).find((item) =>
        item.type.startsWith("image/"),
      );
      if (!imageItem) return;

      const file = imageItem.getAsFile();
      if (!file) return;

      if (!enableImageUpload) {
        e.preventDefault();
        showImageUploadNotAllowedToast();
        return;
      }

      e.preventDefault();
      setPendingFile(file);
    };

    const hasMessage = value.trim().length > 0 || !!selectedImage;
    const baseDisabled = Boolean(isLoading || disabled);
    const attachButtonTitle = enableImageUpload
      ? "افزودن تصویر"
      : "پکیج فعلی اجازهٔ آپلود عکس نمی‌دهد — برای اطلاع بیشتر بزنید";

    return (
      <Field
        orientation="vertical"
        className={cn("gap-0 overflow-visible p-2", className)}
        data-invalid={false}
      >
        <Label htmlFor="chat-input" className="sr-only">
          پیام
        </Label>

        {/* Gallery uses a native file input; the camera path opens an in-app
            `getUserMedia` view so it works on desktop too (where `capture` only
            reopens a file dialog) and prompts for browser camera permission. */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
          disabled={baseDisabled || !enableImageUpload}
        />

        <ImageSourceSheet
          open={sourceSheetOpen}
          onOpenChange={setSourceSheetOpen}
          onPickGallery={() => galleryInputRef.current?.click()}
          onPickCamera={() => setCameraOpen(true)}
        />

        <CameraCaptureDialog
          open={cameraOpen}
          onCapture={(file) => {
            setCameraOpen(false);
            setPendingFile(file);
          }}
          onClose={() => setCameraOpen(false)}
        />

        <ImageCropDialog
          file={pendingFile}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />

        <div className="relative w-full">
          {showGlow && (
            <Image
              src="/pictures/glow.svg"
              alt=""
              width={375}
              height={165}
              aria-hidden
              loading="lazy"
              unoptimized
              className="pointer-events-none absolute top-0 left-1/2 z-0 h-[150px] w-[200%] max-w-none -translate-x-1/2 -translate-y-1/4 select-none"
            />
          )}
          <div className="relative z-10 w-full rounded-2xl border border-input bg-white shadow-[0_2px_4px_0_#AEAEAE] focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/50 dark:bg-input/30">
            <div dir="rtl" className="p-3 pb-0">
              {selectedImage && previewUrl && (
                <div className="mb-2 flex items-center justify-start">
                  <div className="relative inline-flex rounded-2xl border border-border bg-muted/30 p-2">
                    <Image
                      src={previewUrl}
                      alt={selectedImage.name || "پیش‌نمایش تصویر"}
                      width={100}
                      height={100}
                      className="max-h-28 rounded-xl object-cover"
                      unoptimized
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -left-2 size-6 rounded-full"
                      aria-label="حذف تصویر"
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                </div>
              )}
              <Textarea
                ref={textareaRef}
                id="chat-input"
                dir="rtl"
                className="max-h-64 min-h-12 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:outline-none"
                placeholder="سوالتو اینجا بپرس"
                value={value}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                disabled={baseDisabled}
                rows={1}
                {...(tourInputDataTour
                  ? { "data-tour": tourInputDataTour }
                  : undefined)}
                {...props}
              />
            </div>

            <div className="flex items-center justify-between gap-2 px-3 pt-1 pb-3">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleAttachClick}
                disabled={baseDisabled}
                title={attachButtonTitle}
                aria-label={attachButtonTitle}
                className={cn(
                  "shrink-0 rounded-full",
                  !enableImageUpload &&
                    !baseDisabled &&
                    "opacity-50 hover:opacity-70",
                )}
              >
                <Plus className="size-5" />
              </Button>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  size="icon"
                  onClick={handleSend}
                  disabled={!hasMessage || baseDisabled}
                  className="rounded-full"
                  aria-label="ارسال پیام"
                  {...(tourSendDataTour
                    ? { "data-tour": tourSendDataTour }
                    : undefined)}
                >
                  <ArrowUp className="size-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Field>
    );
  },
);

ChatInput.displayName = "ChatInput";

export { ChatInput };
