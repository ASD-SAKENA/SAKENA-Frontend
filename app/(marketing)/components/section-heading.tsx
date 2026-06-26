import { cn } from "@/lib/utils";

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({ eyebrow, title, subtitle, className }: Props) {
  return (
    <div className={cn("mx-auto max-w-[620px] text-center", className)}>
      <div className="mb-3.5 text-[13.5px] font-semibold tracking-widest text-[var(--sk-gold)]">
        {eyebrow}
      </div>
      <h2 className="text-4xl font-extrabold">{title}</h2>
      {subtitle ? (
        <p className="mt-4 text-base leading-[2] text-[var(--sk-text-muted)]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
