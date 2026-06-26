"use client";

import * as React from "react";

import {
  AnimatePresence,
  motion,
  type PanInfo,
  useDragControls,
} from "motion/react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/** Drag distance (px) or downward velocity (px/s) past which a release closes. */
const DRAG_CLOSE_THRESHOLD = 80;
const DRAG_VELOCITY_THRESHOLD = 500;

const SHEET_TRANSITION = {
  type: "spring",
  damping: 34,
  stiffness: 330,
} as const;

const BottomSheetContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
} | null>(null);

function BottomSheet({
  open = false,
  onOpenChange,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const handleOpenChange = React.useCallback(
    (next: boolean) => onOpenChange?.(next),
    [onOpenChange],
  );

  return (
    <BottomSheetContext.Provider
      value={{ open, onOpenChange: handleOpenChange }}
    >
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} {...props}>
        {children}
      </DialogPrimitive.Root>
    </BottomSheetContext.Provider>
  );
}

function BottomSheetContent({
  className,
  children,
  title,
  dir = "rtl",
  style,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  title: string;
}) {
  const context = React.useContext(BottomSheetContext);
  const dragControls = useDragControls();

  const handleDragEnd = (
    _event: PointerEvent | MouseEvent | TouchEvent,
    info: PanInfo,
  ) => {
    if (
      info.offset.y > DRAG_CLOSE_THRESHOLD ||
      info.velocity.y > DRAG_VELOCITY_THRESHOLD
    ) {
      context?.onOpenChange(false);
    }
  };

  return (
    <AnimatePresence>
      {context?.open ? (
        <>
          <DialogPrimitive.Overlay asChild forceMount>
            <motion.div
              data-slot="sheet-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute inset-0 z-50 bg-black/10",
                "supports-backdrop-filter:backdrop-blur-xs",
              )}
            />
          </DialogPrimitive.Overlay>

          <DialogPrimitive.Content asChild forceMount dir={dir} {...props}>
            <motion.div
              data-slot="sheet-content"
              drag="y"
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 1 }}
              onDragEnd={handleDragEnd}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={SHEET_TRANSITION}
              style={style}
              className={cn(
                "absolute inset-x-0 bottom-0 z-50 flex max-h-[75dvh] flex-col",
                "rounded-t-4xl border-t bg-background px-5 pt-0 pb-8 shadow-lg outline-none",
                className,
              )}
            >
              <DialogPrimitive.Title className="sr-only">
                {title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">
                {title}
              </DialogPrimitive.Description>

              <div
                className="mx-auto mt-3 mb-4 h-5 w-16 shrink-0 cursor-grab touch-none rounded-full active:cursor-grabbing"
                onPointerDown={(event) => dragControls.start(event)}
              >
                <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-slate-300" />
              </div>

              {children}
            </motion.div>
          </DialogPrimitive.Content>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export { BottomSheet, BottomSheetContent };
