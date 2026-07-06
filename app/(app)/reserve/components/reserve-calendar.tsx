"use client";

import { toast } from "sonner";

import { baseBookingsFor } from "@/api/reserve";

import {
  ROW,
  SLOTS,
  slotTime,
  START_HOUR,
  useReserveStore,
} from "@/stores/reserve.store";

import { toFaDigits } from "@/lib/persian-number";
import { cn } from "@/lib/utils";

import type { StatusColor } from "@/types/app.type";
import type { Booking } from "@/types/reserve.type";

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

interface RenderBooking extends Booking {
  mine: boolean;
}

/** Now-indicator offset: design pins it to 14:20 within the 08–22 grid. */
const NOW_TOP = Math.round(((14 - START_HOUR) * 2 + 20 / 30) * ROW);

export function ReserveCalendar() {
  const selFacility = useReserveStore((s) => s.selFacility);
  const weekOffset = useReserveStore((s) => s.weekOffset);
  const myBookings = useReserveStore((s) => s.myBookings);
  const drag = useReserveStore((s) => s.drag);
  const openComposer = useReserveStore((s) => s.openComposer);
  const startDrag = useReserveStore((s) => s.startDrag);
  const dragTo = useReserveStore((s) => s.dragTo);
  const endDrag = useReserveStore((s) => s.endDrag);
  const cancelMine = useReserveStore((s) => s.cancelMine);
  const consumeJustDragged = useReserveStore((s) => s.consumeJustDragged);

  const weekStart = 14 + weekOffset * 7;
  const todayIdx = weekOffset === 0 ? 1 : -1;

  const baseBk = baseBookingsFor(selFacility);
  const mineBk = myBookings.filter(
    (b) => b.facility === selFacility && b.week === weekOffset,
  );
  const allBk: RenderBooking[] = [
    ...baseBk.map((b) => ({ ...b, mine: false })),
    ...mineBk.map((b) => ({
      day: b.day,
      start: b.start,
      dur: b.dur,
      who: "",
      mine: true,
    })),
  ];

  const hourLabels: string[] = [];
  for (let hh = START_HOUR; hh < 22; hh++) {
    hourLabels.push(slotTime((hh - START_HOUR) * 2));
  }

  const handleCellClick = (day: number, slot: number) => {
    if (consumeJustDragged()) return;
    openComposer(day, slot, 2);
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
                    {toFaDigits(weekStart + di)}
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
              const dayBlocks = allBk.filter((b) => b.day === di);
              const showDrag = drag.dragging && drag.day === di;
              const dragA = Math.min(drag.start, drag.end);
              const dragB = Math.max(drag.start, drag.end);

              return (
                <div
                  key={name}
                  className="relative min-w-0 flex-1 border-l border-app-border"
                >
                  {Array.from({ length: SLOTS }, (_, slot) => {
                    const hourEnd = slot % 2 === 1;
                    return (
                      <div
                        key={slot}
                        onClick={() => handleCellClick(di, slot)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          startDrag(di, slot);
                        }}
                        onMouseEnter={() => dragTo(di, slot)}
                        className={cn(
                          "cursor-pointer transition-[background] duration-100 select-none hover:bg-[var(--ap-gold-soft)]",
                          hourEnd
                            ? "border-b border-solid border-app-border"
                            : "border-b border-dashed border-[rgba(150,160,180,0.14)]",
                        )}
                        style={{ height: ROW }}
                      />
                    );
                  })}

                  {dayBlocks.map((b, i) => {
                    const top = b.start * ROW;
                    const height = b.dur * ROW - 3;
                    const time = `${slotTime(b.start)} – ${slotTime(
                      b.start + b.dur,
                    )}`;
                    if (b.mine) {
                      return (
                        <div
                          key={`mine-${b.start}-${b.dur}`}
                          onClick={() =>
                            cancelMine({
                              facility: selFacility,
                              week: weekOffset,
                              day: b.day,
                              start: b.start,
                              dur: b.dur,
                            })
                          }
                          className="absolute right-1 left-1 z-[3] cursor-pointer overflow-hidden rounded-lg bg-[linear-gradient(155deg,var(--ap-gold-light),var(--ap-gold))] px-2 py-[5px] text-app-gold-fg shadow-[0_4px_12px_rgba(201,162,78,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] transition-[filter] hover:brightness-105"
                          style={{ top, height }}
                        >
                          <div className="truncate text-[11px] leading-[1.4] font-bold">
                            رزرو شما · لغو
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
                        key={`other-${b.start}-${b.who}`}
                        onClick={() =>
                          toast(`این بازه توسط ${b.who} رزرو شده است`)
                        }
                        className="absolute right-1 left-1 z-[2] cursor-pointer overflow-hidden rounded-lg border border-[var(--ap-glass-brd)] px-2 py-[5px] text-app-fg backdrop-blur-[6px] transition-[filter] hover:brightness-105"
                        style={{
                          top,
                          height,
                          background: `color-mix(in srgb, var(--ap-${color}) 17%, transparent)`,
                          borderRightWidth: 3,
                          borderRightColor: `var(--ap-${color})`,
                        }}
                      >
                        <div className="truncate text-[11px] leading-[1.4] font-bold">
                          {b.who}
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
                      {`${slotTime(dragA)} – ${slotTime(dragB + 1)}`}
                    </div>
                  )}

                  {isToday && (
                    <div
                      className="pointer-events-none absolute right-0 left-0 z-[5] h-0.5 bg-app-danger"
                      style={{ top: NOW_TOP }}
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
    </div>
  );
}
