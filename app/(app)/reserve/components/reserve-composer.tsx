"use client";

import { useState } from "react";

import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { Modal } from "@/components/app/modal";
import { TopUpWalletModal } from "@/components/app/top-up-wallet-modal";

import {
  useCreateBookingMutation,
  useFacilityBookingsQuery,
} from "@/queries/reserve";
import { useMyWalletQuery } from "@/queries/wallet";

import { useReserveStore } from "@/stores/reserve.store";

import { useSelectedFacility } from "@/hooks/use-selected-facility";

import { exceedsAmount, formatToman, toFaDigits } from "@/lib/persian-number";
import {
  DEFAULT_RULES,
  isBeyondAdvanceWindow,
  isPastSlot,
  peakPeopleInRange,
  SLOT_MINUTES,
  slotPrice,
  slotTime,
  weekStartDate,
} from "@/lib/reserve-time";
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

/** «۳۰ دقیقه» / «۱ ساعت» / «۱.۵ ساعت» for a duration in half-hour rows. */
function durLabel(dur: number): string {
  const minutes = dur * SLOT_MINUTES;
  if (minutes < 60) return `${toFaDigits(minutes)} دقیقه`;
  const hours = minutes / 60;
  const shown = Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
  return `${toFaDigits(shown)} ساعت`;
}

export function ReserveComposer() {
  const { selected } = useSelectedFacility();
  const weekOffset = useReserveStore((s) => s.weekOffset);
  const composer = useReserveStore((s) => s.composer);
  const setDur = useReserveStore((s) => s.setDur);
  const closeComposer = useReserveStore((s) => s.closeComposer);

  const rules = selected?.rules ?? DEFAULT_RULES;
  const { data: bookings = [] } = useFacilityBookingsQuery(
    selected?.id ?? null,
    weekOffset,
    rules,
  );
  const createBooking = useCreateBookingMutation();

  const cStart = composer.start;
  const cDur = Math.min(Math.max(composer.dur, rules.minSlots), rules.maxSlots);
  const cEnd = cStart + cDur;

  const weekStart = weekStartDate(weekOffset);
  const composerDate = new Date(weekStart);
  composerDate.setDate(composerDate.getDate() + composer.day);
  const dayLabel = `${DAY_NAMES[composer.day]} ${composerDate.toLocaleDateString(
    "fa-IR",
    { day: "numeric", month: "long" },
  )}`;

  const [partySize, setPartySize] = useState(1);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const { data: balance = 0 } = useMyWalletQuery();

  const durChoices: number[] = [];
  for (let dur = rules.minSlots; dur <= rules.maxSlots; dur++) {
    durChoices.push(dur);
  }

  const overlapping = bookings.filter(
    (b) => b.day === composer.day && cStart < b.start + b.dur && b.start < cEnd,
  );
  const conflictMine = overlapping.some((b) => b.mine);
  // Capacity is people at a moment, not bookings over a range: an 08:00-09:00
  // booking must not consume seats from the 09:00-10:00 slot next to it.
  const peopleBooked = peakPeopleInRange(bookings, composer.day, cStart, cDur);
  const seatsLeft = selected !== null ? selected.capacity - peopleBooked : 0;
  const capacityFull = selected !== null && seatsLeft <= 0;
  const partyTooBig = partySize > seatsLeft;
  // The party can also simply exceed what the facility holds at all.
  const overFacilityCapacity =
    selected !== null && partySize > selected.capacity;
  const closedDay = rules.closedDays.includes(composer.day);
  const pastSlot = isPastSlot(
    weekOffset,
    composer.day,
    cStart,
    rules.startHour,
  );
  const tooFarAhead = isBeyondAdvanceWindow(
    weekOffset,
    composer.day,
    cStart,
    rules,
  );
  const overrunsClosing = cEnd > rules.slots;

  // Per-person hourly rate, so the total moves with the party size.
  const price = slotPrice(rules, cDur, partySize);
  // Sending a booking the wallet cannot pay for only earns a server-side
  // rejection, so the shortfall is caught here instead.
  // Compared in whole cents: a sub-rial floating-point drift must not block a
  // resident whose balance exactly covers the booking.
  const cannotAfford = exceedsAmount(price, balance);
  const shortfall = cannotAfford ? price - balance : 0;

  const blocked =
    overrunsClosing ||
    conflictMine ||
    cannotAfford ||
    capacityFull ||
    partyTooBig ||
    overFacilityCapacity ||
    closedDay ||
    pastSlot ||
    tooFarAhead;

  const remaining = Math.max(seatsLeft, 0);

  const warning = ((): string | null => {
    if (closedDay) return "این امکان در این روز تعطیل است.";
    if (pastSlot) {
      return "زمان انتخاب‌شده گذشته است؛ بازه‌ای در آینده انتخاب کنید.";
    }
    if (tooFarAhead) {
      return `رزرو حداکثر تا ${toFaDigits(rules.maxAdvanceDays)} روز آینده ممکن است.`;
    }
    if (overrunsClosing)
      return "پایان رزرو از ساعت کاری این امکان فراتر می‌رود.";
    if (overFacilityCapacity && selected) {
      return `ظرفیت کل این امکان ${toFaDigits(selected.capacity)} نفر است.`;
    }
    if (capacityFull) {
      return "ظرفیت این سانس تکمیل شده و قفل است. زمان دیگری انتخاب کنید.";
    }
    if (partyTooBig) {
      return `در این بازه فقط ${toFaDigits(remaining)} نفر جای خالی هست؛ تعداد نفرات را کم کنید.`;
    }
    if (conflictMine) {
      return "شما در این بازه رزرو دیگری دارید. مدت یا زمان دیگری انتخاب کنید.";
    }
    if (cannotAfford) {
      return `موجودی کیف پول شما ${formatToman(shortfall)} کمتر از هزینه این رزرو است.`;
    }
    return null;
  })();

  const handleConfirm = () => {
    if (!selected || blocked || createBooking.isPending) return;
    createBooking.mutate(
      {
        facilityId: selected.id,
        weekOffset,
        day: composer.day,
        start: cStart,
        dur: cDur,
        startHour: rules.startHour,
        partySize,
      },
      {
        onSuccess: () => {
          toast.success("رزرو شما با موفقیت ثبت شد");
          closeComposer();
        },
        // Capacity/conflict rejections surface via the global 409 toast.
      },
    );
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
          <div className="text-[18px] font-extrabold">
            {slotTime(cStart, rules.startHour)}
          </div>
        </div>
        <div className="flex items-center text-app-muted">
          <AppIcon name="arrow_back" className="size-5" />
        </div>
        <div className="flex-1 rounded-xl bg-app-surface2 px-[15px] py-[13px]">
          <div className="mb-[5px] text-[12px] text-app-muted">پایان</div>
          <div className="text-[18px] font-extrabold text-app-gold">
            {slotTime(cEnd, rules.startHour)}
          </div>
        </div>
      </div>

      <label className="mb-[9px] block text-[13px] font-medium">مدت رزرو</label>
      <div className="mb-[18px] flex flex-wrap gap-2">
        {durChoices.map((dur) => {
          const active = cDur === dur;
          return (
            <button
              key={dur}
              type="button"
              onClick={() => setDur(dur)}
              className={cn(
                "h-10 min-w-[84px] flex-1 rounded-[10px] border text-[12.5px] font-semibold transition-[border-color,background,color]",
                active
                  ? "border-app-gold bg-[var(--ap-gold-soft)] text-app-gold"
                  : "border-app-border bg-transparent text-app-fg hover:border-app-gold",
              )}
            >
              {durLabel(dur)}
            </button>
          );
        })}
      </div>

      <label className="mb-[9px] block text-[13px] font-medium">
        تعداد نفرات
      </label>
      <div className="mb-[18px] flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setPartySize((n) => Math.max(1, n - 1))}
          disabled={partySize <= 1}
          aria-label="کاهش تعداد نفرات"
          className="flex size-10 items-center justify-center rounded-[10px] border border-app-border text-app-fg transition-colors hover:border-app-gold disabled:opacity-40"
        >
          <AppIcon name="remove" className="size-[18px]" />
        </button>
        <span className="min-w-[64px] text-center text-[15px] font-bold text-app-fg">
          {toFaDigits(partySize)} نفر
        </span>
        <button
          type="button"
          onClick={() => setPartySize((n) => n + 1)}
          disabled={partySize >= remaining}
          aria-label="افزایش تعداد نفرات"
          className="flex size-10 items-center justify-center rounded-[10px] border border-app-border text-app-fg transition-colors hover:border-app-gold disabled:opacity-40"
        >
          <AppIcon name="add" className="size-[18px]" />
        </button>
      </div>

      {warning ? (
        <div className="mb-[18px] flex items-center gap-[9px] rounded-[11px] border border-[color-mix(in_srgb,var(--ap-danger)_30%,transparent)] bg-[color-mix(in_srgb,var(--ap-danger)_12%,transparent)] px-[14px] py-[11px]">
          <AppIcon name="error" className="size-5 text-app-danger" />
          <span className="text-[13px] text-app-danger">{warning}</span>
        </div>
      ) : selected ? (
        <div className="mb-[18px] flex items-center gap-[9px] rounded-[11px] border border-app-border bg-app-surface2 px-[14px] py-[11px]">
          <AppIcon name="groups" className="size-5 text-app-steel" />
          <span className="text-[13px] text-app-muted">
            ظرفیت باقی‌مانده این سانس: {toFaDigits(remaining)} از{" "}
            {toFaDigits(selected.capacity)} نفر
            {rules.maxPerWeek > 0
              ? ` · سقف رزرو هر ساکن در هفته: ${toFaDigits(rules.maxPerWeek)}`
              : ""}
          </span>
        </div>
      ) : null}

      <div className="mb-[18px] border-t border-app-border py-[14px]">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-app-muted">هزینه</span>
          <span className="text-[15px] font-bold text-app-gold">
            {price > 0 ? formatToman(price) : "رایگان"}
          </span>
        </div>
        {price > 0 ? (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[12.5px] text-app-muted">
              موجودی کیف پول شما
            </span>
            <span
              className={cn(
                "text-[12.5px] font-semibold",
                cannotAfford ? "text-app-danger" : "text-app-muted",
              )}
            >
              {formatToman(balance)}
            </span>
          </div>
        ) : null}
      </div>

      {cannotAfford ? (
        <AppButton
          variant="gold"
          onClick={() => setTopUpOpen(true)}
          className="h-[46px] w-full text-[14.5px]"
        >
          <AppIcon name="account_balance_wallet" className="size-[19px]" />
          افزایش موجودی کیف پول
        </AppButton>
      ) : (
        <AppButton
          variant="gold"
          disabled={blocked || createBooking.isPending}
          onClick={handleConfirm}
          className="h-[46px] w-full text-[14.5px]"
        >
          تأیید و ثبت رزرو
        </AppButton>
      )}

      <TopUpWalletModal open={topUpOpen} onClose={() => setTopUpOpen(false)} />
    </Modal>
  );
}
