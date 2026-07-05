"use client";

import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

import { AppIcon } from "./app-icon";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Optional leading icon chip next to the title. */
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  className,
}: Props) {
  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-[rgba(5,8,16,0.6)] backdrop-blur-[3px] data-[state=open]:animate-in data-[state=open]:fade-in" />
        <DialogPrimitive.Content
          dir="rtl"
          className={cn(
            "fixed top-1/2 left-1/2 z-[60] w-[calc(100%-40px)] max-w-[480px] -translate-x-1/2 -translate-y-1/2",
            "rounded-[20px] border border-[var(--ap-glass-brd)] bg-[var(--ap-glass-bg)] p-[26px] text-app-fg shadow-[var(--ap-shadow)] backdrop-blur-[26px]",
            "data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in",
            className,
          )}
        >
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {icon ? (
                <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--ap-gold-soft)] text-app-gold">
                  <AppIcon name={icon} className="size-[22px]" />
                </div>
              ) : null}
              <div>
                <DialogPrimitive.Title className="text-[18px] font-bold">
                  {title}
                </DialogPrimitive.Title>
                {description ? (
                  <DialogPrimitive.Description className="mt-0.5 text-[12.5px] text-app-muted">
                    {description}
                  </DialogPrimitive.Description>
                ) : null}
              </div>
            </div>
            <DialogPrimitive.Close className="flex size-[34px] items-center justify-center rounded-[9px] bg-app-surface2 text-app-fg">
              <AppIcon name="close" className="size-5" />
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
