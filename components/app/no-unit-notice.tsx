import { AppIcon } from "@/components/app/app-icon";

/** Shown instead of a resident-only page's content until a manager moves them into a unit. */
export function NoUnitNotice() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-app-border bg-app-surface p-10 text-center">
      <AppIcon name="apartment" className="size-9 text-app-muted" />
      <div className="text-[14.5px] font-semibold text-app-fg">
        شما هنوز عضو هیچ واحدی نیستید
      </div>
      <div className="max-w-[360px] text-[13px] text-app-muted">
        پس از اینکه مدیر ساختمان شما را به یک واحد اختصاص داد، این بخش در دسترس
        شما قرار می‌گیرد.
      </div>
    </div>
  );
}
