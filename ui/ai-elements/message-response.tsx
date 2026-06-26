"use client";

import { type ComponentProps, memo } from "react";

import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { math } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";
import { Streamdown } from "streamdown";

import { normalizeMathMarkdown } from "@/lib/normalize-math-markdown";
import { cn } from "@/lib/utils";

export type MessageResponseProps = ComponentProps<typeof Streamdown>;

const streamdownPlugins = { cjk, code, math, mermaid };

export const MessageResponse = memo(
  ({ className, children, ...props }: MessageResponseProps) => {
    const normalizedChildren =
      typeof children === "string" ? normalizeMathMarkdown(children) : children;

    return (
      <Streamdown
        className={cn(
          "message-response size-full text-slate-700 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          className,
        )}
        plugins={streamdownPlugins}
        {...props}
      >
        {normalizedChildren}
      </Streamdown>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

MessageResponse.displayName = "MessageResponse";

export default MessageResponse;
