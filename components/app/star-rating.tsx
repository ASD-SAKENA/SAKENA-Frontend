"use client";

import { AppIcon } from "@/components/app/app-icon";

import { cn } from "@/lib/utils";

interface Props {
  value: number;
  onChange: (score: number) => void;
  readOnly?: boolean;
  className?: string;
}

const STARS = [1, 2, 3, 4, 5];

export function StarRating({
  value,
  onChange,
  readOnly = false,
  className,
}: Props) {
  if (readOnly) {
    return (
      <div
        className={cn("flex items-center gap-0.5", className)}
        role="img"
        aria-label={`${value} از ۵`}
      >
        {STARS.map((star) => (
          <AppIcon
            key={star}
            name="star"
            className={cn(
              "size-4",
              star <= value ? "text-app-gold" : "text-app-border",
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`${star} ستاره`}
          className="flex size-8 items-center justify-center"
        >
          <AppIcon
            name="star"
            className={cn(
              "size-5 transition-colors",
              star <= value ? "text-app-gold" : "text-app-border",
            )}
          />
        </button>
      ))}
    </div>
  );
}
