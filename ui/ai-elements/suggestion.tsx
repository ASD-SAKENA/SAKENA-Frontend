"use client";

import type { ComponentProps } from "react";
import { useCallback } from "react";

import { Reply } from "lucide-react";

import { MessageResponse } from "@/ui/ai-elements/message";
import { Button } from "@/ui/button";

import { cn } from "@/lib/utils";

export type SuggestionsProps = ComponentProps<"div">;

export const Suggestions = ({
  className,
  children,
  ...props
}: SuggestionsProps) => (
  <div className="w-full" {...props}>
    <p className="mb-2 text-sm text-slate-400">سوالات پیشنهادی</p>
    <div
      dir="rtl"
      className={cn(
        "ml-auto flex w-full flex-col items-start gap-2",
        className,
      )}
    >
      {children}
    </div>
  </div>
);

export type SuggestionProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  suggestion: string;
  onClick?: (suggestion: string) => void;
};

export const Suggestion = ({
  suggestion,
  onClick,
  className,
  variant = "outline",
  size = "sm",
  children,
  ...props
}: SuggestionProps) => {
  const handleClick = useCallback(() => {
    onClick?.(suggestion);
  }, [onClick, suggestion]);
  const content = children ?? suggestion;
  const isStringContent = typeof content === "string";
  return (
    <Button
      className={cn(
        "flex h-fit max-w-full shrink rounded-2xl p-0 text-right whitespace-normal",
        className,
      )}
      onClick={handleClick}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      <Reply
        aria-hidden
        className="size-4 shrink-0 text-inherit"
        strokeWidth={2}
        style={{ transform: "scaleY(-1)" }}
      />

      <span className="min-w-0 flex-1 text-[14px] font-normal wrap-break-word whitespace-normal">
        {isStringContent ? (
          <MessageResponse className="text-inherit">{content}</MessageResponse>
        ) : (
          <>{content}</>
        )}
      </span>
    </Button>
  );
};
