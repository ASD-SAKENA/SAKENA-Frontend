import type { LandingStat } from "@/types/landing.type";

interface Props {
  stats: LandingStat[];
}

export function StatsBand({ stats }: Props) {
  return (
    <section className="border-y border-[var(--sk-border-subtle)] bg-[var(--sk-bg-band)]">
      <div className="mx-auto flex max-w-[1100px] flex-wrap justify-between gap-10 px-8 py-[34px] max-[900px]:gap-6 max-[560px]:px-5">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-[120px] flex-1 text-center">
            <div className="text-[34px] font-black text-[var(--sk-gold-light)]">
              {stat.value}
            </div>
            <div className="mt-1.5 text-[13.5px] text-[var(--sk-text-muted)]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
