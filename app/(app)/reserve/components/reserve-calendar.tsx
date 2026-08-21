"use client";

import { useState } from "react";

import { useFacilityBookingsQuery } from "@/queries/reserve";

import { useAuthStore } from "@/stores/auth.store";
import { ROW, useReserveStore } from "@/stores/reserve.store";

import { useSelectedFacility } from "@/hooks/use-selected-facility";

import { toFaDigits } from "@/lib/persian-number";
import {
  DEFAULT_RULES,
  isBeyondAdvanceWindow,
  isPastSlot,
  peopleAtSlot,
  slotTime,
  weekStartDate,
} from "@/lib/reserve-time";
import { cn } from "@/lib/utils";

import type { StatusColor } from "@/types/app.type";
import type { GridBooking } from "@/types/reserve.type";

import { BookingDetailsModal } from "./booking-details-modal";

const DAY_NAMES = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

/** Cycled accent colors for other residents' blocks. */
const OTHER_PALETTE: StatusColor[] = ["info", "success", "steel", "warning"];

export function ReserveCalendar() {
  const { selected } = useSelectedFacility();
  const isManager = useAuthStore((s) => s.user?.role) === "manager";
  const weekOffset = useReserveStore((s) => s.weekOffset);
  const drag = useReserveStore((s) => s.drag);
  const openComposer = useReserveStore((s) => s.openComposer);
  const startDrag = useReserveStore((s) => s.startDrag);
  const dragTo = useReserveStore((s) => s.dragTo);
  const endDrag = useReserveStore((s) => s.endDrag);
  const consumeJustDragged = useReserveStore((s) => s.consumeJustDragged);

  const rules = selected?.rules ?? DEFAULT_RULES;
  const { data: bookings = [] } = useFacilityBookingsQuery(
    selected?.id ?? null,
    weekOffset,
    rules,
  );
  const [openBooking, setOpenBooking] = useState<GridBooking | null>(null);

  const weekStart = weekStartDate(weekOffset);
  const todayIdx = weekOffset === 0 ? (new Date().getDay() + 1) % 7 : -1;

  const dayNumber = (di: number): string => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + di);
    return date.toLocaleDateString("fa-IR", { day: "numeric" });
  };

  const hourLabels: string[] = [];
  for (let hh = rules.startHour; hh < rules.endHour; hh++) {
    hourLabels.push(slotTime((hh - rules.startHour) * 2, rules.startHour));
  }

  /** The now-indicator only makes sense while the grid is open. */
  const now = new Date();
  const nowSlot =
    (now.getHours() - rules.startHour) * 2 + now.getMinutes() / 30;
  const nowTop = nowSlot >= 0 && nowSlot <= rules.slots ? nowSlot * ROW : null;

  const capacity = selected?.capacity ?? 0;

  /** Seats still free at a given row — capacity applies per moment. */
  const seatsFreeAt = (day: number, slot: number): number =>
    capacity - peopleAtSlot(bookings, day, slot);

  const isBookable = (day: number, slot: number): boolean =>
    !rules.closedDays.includes(day) &&
    !isPastSlot(weekOffset, day, slot, rules.startHour) &&
    !isBeyondAdvanceWindow(weekOffset, day, slot, rules) &&
    seatsFreeAt(day, slot) > 0;

  const handleCellClick = (day: number, slot: number) => {
    if (consumeJustDragged()) return;
    if (!isBookable(day, slot)) return;
    openComposer(day, slot, rules.minSlots);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-[var(--ap-shadow-sm)]">
      <div className="sk-scroll max-h-[580px] overflow-auto">
        <div
          className="min-w-[720px]"
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
        >
          {/* sticky day header */}
          <div className="sticky top-0 z-[6] flex border-b border-app-border bg-[var(--ap-glass-bg)] backdrop-blur-[16px] backdrop-saturate-[1.4]">
            <div className="w-[60px] flex-shrink-0 border-l border-app-border" />
            {DAY_NAMES.map((name, di) => {
              const isToday = di === todayIdx;
              return (
                <div
                  key={name}
                  className={cn(
                    "flex-1 border-l border-app-border px-1 py-[9px] text-center",
                    isToday && "bg-[var(--ap-gold-soft)]",
                  )}
                >
                  <div className="text-[12px] text-app-muted">{name}</div>
                  <div
                    className={cn(
                      "mt-[3px] text-[16px] font-extrabold",
                      isToday && "text-app-gold",
                    )}
                  >
                    {dayNumber(di)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* body */}
          <div className="flex">
            {/* time gutter */}
            <div className="w-[60px] flex-shrink-0 border-l border-app-border">
              {hourLabels.map((label) => (
                <div key={label} className="relative h-[64px]">
                  <span className="absolute -top-2 right-0 left-0 text-center text-[11px] text-app-muted">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* day columns */}
            {DAY_NAMES.map((name, di) => {
              const isToday = di === todayIdx;
              const isClosed = rules.closedDays.includes(di);
              const dayBlocks = bookings.filter((b) => b.day === di);
              const showDrag = drag.dragging && drag.day === di;
              const dragA = Math.min(drag.start, drag.end);
              const dragB = Math.max(drag.start, drag.end);

              return (
                <div
                  key={name}
                  className="relative min-w-0 flex-1 border-l border-app-border"
                >
                  {Array.from({ length: rules.slots }, (_, slot) => {
                    const hourEnd = slot % 2 === 1;
                    const bookable = isBookable(di, slot);
                    return (
                      <div
                        key={slot}
                        onClick={() => handleCellClick(di, slot)}
                        title={
                          bookable && peopleAtSlot(bookings, di, slot) > 0
                            ? `${toFaDigits(seatsFreeAt(di, slot))} نفر ظرفیت خالی`
                            : undefined
                        }
                        onMouseDown={(e) => {
                          e.preventDefault();
                          if (bookable) startDrag(di, slot);
                        }}
                        onMouseEnter={() => dragTo(di, slot)}
                        className={cn(
                          "transition-[background] duration-100 select-none",
                          hourEnd
                            ? "border-b border-solid border-app-border"
                            : "border-b border-dashed border-[rgba(150,160,180,0.14)]",
                          bookable
                            ? "cursor-pointer hover:bg-[var(--ap-gold-soft)]"
                            : "cursor-not-allowed bg-[color-mix(in_srgb,var(--ap-muted)_9%,transparent)]",
                        )}
                        style={{ height: ROW }}
                      />
                    );
                  })}

                  {dayBlocks.map((b, i) => {
                    const top = b.start * ROW;
                    const height = b.dur * ROW - 3;
                    // While seats remain, the block yields the left half of
                    // the row so another resident can still click to book it.
                    const shared =
                      b.start < rules.slots && isBookable(di, b.start);
                    const time = `${slotTime(b.start, rules.startHour)} – ${slotTime(
                      b.start + b.dur,
                      rules.startHour,
                    )}`;
                    if (b.mine) {
                      return (
                        <div
                          key={b.id}
                          onClick={() => setOpenBooking(b)}
                          className={cn(
                            "absolute z-[3] cursor-pointer overflow-hidden rounded-lg bg-[linear-gradient(155deg,var(--ap-gold-light),var(--ap-gold))] px-2 py-[5px] text-app-gold-fg shadow-[0_4px_12px_rgba(201,162,78,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] transition-[filter] hover:brightness-105",
                            shared ? "right-1 left-1/2" : "right-1 left-1",
                          )}
                          style={{ top, height }}
                        >
                          <div className="truncate text-[11px] leading-[1.4] font-bold">
                            رزرو شما · {toFaDigits(b.partySize)} نفر
                          </div>
                          <div className="truncate text-[10.5px] leading-[1.4] text-[rgba(10,14,26,0.72)]">
                            {time}
                          </div>
                        </div>
                      );
                    }
                    const color = OTHER_PALETTE[i % OTHER_PALETTE.length];
                    return (
                      <div
                        key={b.id}
                        onClick={() => setOpenBooking(b)}
                        className={cn(
                          "absolute z-[2] cursor-pointer overflow-hidden rounded-lg border border-[var(--ap-glass-brd)] px-2 py-[5px] text-app-fg backdrop-blur-[6px] transition-[filter] hover:brightness-105",
                          shared ? "right-1 left-1/2" : "right-1 left-1",
                        )}
                        style={{
                          top,
                          height,
                          background: `color-mix(in srgb, var(--ap-${color}) 17%, transparent)`,
                          borderRightWidth: 3,
                          borderRightColor: `var(--ap-${color})`,
                        }}
                      >
                        <div className="truncate text-[11px] leading-[1.4] font-bold">
                          رزرو شده · {toFaDigits(b.partySize)} نفر
                        </div>
                        <div className="truncate text-[10.5px] leading-[1.4] text-app-muted">
                          {time}
                        </div>
                      </div>
                    );
                  })}

                  {showDrag && (
                    <div
                      className="pointer-events-none absolute right-1 left-1 z-[4] flex items-center justify-center rounded-lg border-[1.5px] border-dashed border-app-gold bg-[var(--ap-gold-soft)] text-[11px] font-bold text-app-gold"
                      style={{
                        top: dragA * ROW,
                        height: (dragB - dragA + 1) * ROW,
                      }}
                    >
                      {`${slotTime(dragA, rules.startHour)} – ${slotTime(
                        dragB + 1,
                        rules.startHour,
                      )}`}
                    </div>
                  )}

                  {isClosed && (
                    <div className="pointer-events-none absolute inset-0 z-[4] flex items-start justify-center pt-4">
                      <span className="rounded-md bg-app-surface2 px-2 py-1 text-[11px] font-semibold text-app-muted">
                        تعطیل
                      </span>
                    </div>
                  )}

                  {isToday && nowTop !== null && (
                    <div
                      className="pointer-events-none absolute right-0 left-0 z-[5] h-0.5 bg-app-danger"
                      style={{ top: nowTop }}
                    >
                      <span className="absolute -top-[3px] -right-[3px] size-2 rounded-full bg-app-danger" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BookingDetailsModal
        booking={openBooking}
        facilityId={selected?.id ?? ""}
        facilityLabel={selected?.label ?? ""}
        canCancel={isManager || (openBooking?.mine ?? false)}
        onClose={() => setOpenBooking(null)}
      />
    </div>
  );
}
