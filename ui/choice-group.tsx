import { cn } from "@/lib/utils";

export type ChoiceOption = {
  label: string;
  icon?: React.ReactElement;
};

type ChoiceGroupProps = {
  label: string;
  helperText?: string;
  value: string | null;
  onChange: (value: string) => void;
  choices: ChoiceOption[];
};

export function ChoiceGroup({
  label,
  helperText,
  value,
  onChange,
  choices,
}: ChoiceGroupProps) {
  return (
    <section className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">{label}*</label>
        {helperText && (
          <p className="flex-1 text-left text-xs text-slate-500">
            {helperText}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {choices.map((choice) => {
          const Icon = choice.icon;
          const isActive = value === choice.label;

          return (
            <button
              key={choice.label}
              type="button"
              onClick={() => onChange(choice.label)}
              className={cn(
                "flex items-center justify-center gap-1 rounded-lg border-1 px-2 py-2.5 text-base font-medium transition-colors",
                isActive
                  ? "border-2 border-sky-400 bg-sky-50 font-bold text-sky-500"
                  : "border-slate-300 bg-slate-50/40 text-slate-700 hover:bg-slate-100",
              )}
            >
              {Icon}
              {choice.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
