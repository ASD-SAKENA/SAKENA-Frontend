"use client";

import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { Modal } from "@/components/app/modal";

import { SLOTS, slotTime, useReserveStore } from "@/stores/reserve.store";

import { useSelectedFacility } from "@/hooks/use-selected-facility";

import { formatToman, toFaDigits } from "@/lib/persian-number";
import { cn } from "@/lib/utils";

const DAY_NAMES = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

const DUR_CHIPS: { dur: number; label: string }[] = [
  { dur: 1, label: "۳۰ دقیقه" },
  { dur: 2, label: "۱ ساعت" },
  { dur: 3, label: "۱.۵ ساعت" },
  { dur: 4, label: "۲ ساعت" },
];

export function ReserveComposer() {
  const { selected } = useSelectedFacility();
  const weekOffset = useReserveStore((s) => s.weekOffset);
  const myBookings = useReserveStore((s) => s.myBookings);
  const composer = useReserveStore((s) => s.composer);
  const setDur = useReserveStore((s) => s.setDur);
  const closeComposer = useReserveStore((s) => s.closeComposer);
  const confirmReserve = useReserveStore((s) => s.confirmReserve);

  const cStart = composer.start;
  const cDur = composer.dur;
  const cEnd = cStart + cDur;

  const weekStart = 14 + weekOffset * 7;
  const dayLabel = `${DAY_NAMES[composer.day]} ${toFaDigits(
    weekStart + composer.day,
  )} تیر`;

  const mine = selected
    ? myBookings.filter(
        (b) => b.facilityId === selected.id && b.week === weekOffset,
      )
    : [];
  const conflict =
    cEnd > SLOTS ||
    mine.some(
      (b) =>
        b.day === composer.day && cStart < b.start + b.dur && b.start < cEnd,
    );

  const cost =
    selected?.label === "سالن همایش"
      ? formatToman(100000 * cDur)
      : selected?.label === "استخر"
        ? formatToman(40000 * cDur)
        : "رایگان";

  const handleConfirm = () => {
    if (!selected) return;
    const result = confirmReserve(selected.id);
    if (result.ok) {
      toast.success("رزرو شما با موفقیت ثبت شد");
    } else if (result.conflict) {
      toast("این بازه با رزرو دیگری تداخل دارد");
    }
  };

  return (
    <Modal
      open={composer.open}
      onClose={closeComposer}
      title={`رزرو ${selected?.label ?? ""}`}
      description={dayLabel}
      icon="event"
    >
      <div className="mt-[18px] mb-5 flex gap-2.5">
        <div className="flex-1 rounded-xl bg-app-surface2 px-[15px] py-[13px]">
          <div className="mb-[5px] text-[12px] text-app-muted">شروع</div>
          <div className="text-[18px] font-extrabold">{slotTime(cStart)}</div>
        </div>
        <div className="flex items-center text-app-muted">
          <AppIcon name="arrow_back" className="size-5" />
        </div>
        <div className="flex-1 rounded-xl bg-app-surface2 px-[15px] py-[13px]">
          <div className="mb-[5px] text-[12px] text-app-muted">پایان</div>
          <div className="text-[18px] font-extrabold text-app-gold">
            {slotTime(cEnd)}
          </div>
        </div>
      </div>

      <label className="mb-[9px] block text-[13px] font-medium">مدت رزرو</label>
      <div className="mb-[18px] flex gap-2">
        {DUR_CHIPS.map((chip) => {
          const active = cDur === chip.dur;
          return (
            <button
              key={chip.dur}
              type="button"
              onClick={() => setDur(chip.dur)}
              className={cn(
                "h-10 flex-1 rounded-[10px] border text-[12.5px] font-semibold transition-[border-color,background,color]",
                active
                  ? "border-app-gold bg-[var(--ap-gold-soft)] text-app-gold"
                  : "border-app-border bg-transparent text-app-fg hover:border-app-gold",
              )}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {conflict && (
        <div className="mb-[18px] flex items-center gap-[9px] rounded-[11px] border border-[color-mix(in_srgb,var(--ap-danger)_30%,transparent)] bg-[color-mix(in_srgb,var(--ap-danger)_12%,transparent)] px-[14px] py-[11px]">
          <AppIcon name="error" className="size-5 text-app-danger" />
          <span className="text-[13px] text-app-danger">
            این بازه با رزرو دیگری تداخل دارد. مدت یا زمان دیگری انتخاب کنید.
          </span>
        </div>
      )}

      <div className="mb-[18px] flex items-center justify-between border-t border-app-border py-[14px]">
        <span className="text-[13px] text-app-muted">هزینه</span>
        <span className="text-[15px] font-bold text-app-gold">{cost}</span>
      </div>

      <AppButton
        variant="gold"
        disabled={conflict}
        onClick={handleConfirm}
        className="h-[46px] w-full text-[14.5px]"
      >
        تأیید و ثبت رزرو
      </AppButton>
    </Modal>
  );
}
