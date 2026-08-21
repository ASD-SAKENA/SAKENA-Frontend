"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

interface Props {
  /** Profile picture URL; null or undefined falls back to the initial. */
  src?: string | null;
  /** Shown when there is no picture — usually the first letter of the name. */
  initial: string;
  /** Pixel size of the circle. */
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * A user's picture, or their initial when they have not set one.
 *
 * Every place that shows a person uses this, so the fallback rule lives in
 * one spot rather than being re-decided at each call site.
 */
export function Avatar({
  src,
  initial,
  size = 38,
  className,
  alt = "تصویر پروفایل",
}: Props) {
  const base = cn(
    "flex shrink-0 items-center justify-center overflow-hidden rounded-full",
    className,
  );

  if (!src) {
    return (
      <div
        className={cn(base, "bg-[var(--ap-gold-soft)] font-bold text-app-gold")}
        style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
        aria-hidden="true"
      >
        {initial}
      </div>
    );
  }

  return (
    <div className={base} style={{ width: size, height: size }}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        // The URL is a short-lived presigned link, so it must not be cached
        // or optimized into a stale copy by the image pipeline.
        unoptimized
        className="size-full object-cover"
      />
    </div>
  );
}
