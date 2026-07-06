"use client";

import { create } from "zustand";

import { baseBookingsFor } from "@/api/reserve";

import { toFaDigits } from "@/lib/persian-number";

import type {
  ComposerState,
  DragState,
  FacilityKey,
  MyBooking,
  ReserveResult,
} from "@/types/reserve.type";

export const SLOTS = 28;
export const ROW = 32;
export const START_HOUR = 8;

const DEFAULT_FACILITY: FacilityKey = "سالن ورزش";
const DEFAULT_COMPOSER: ComposerState = {
  open: false,
  day: 0,
  start: 0,
  dur: 2,
};
const DEFAULT_DRAG: DragState = {
  dragging: false,
  day: 0,
  start: 0,
  end: 0,
};

interface ReserveState {
  selFacility: FacilityKey;
  weekOffset: number;
  myBookings: MyBooking[];
  composer: ComposerState;
  drag: DragState;
  /** Guards a click firing right after a drag-select release. */
  justDragged: boolean;
  setFacility: (facility: FacilityKey) => void;
  prevWeek: () => void;
  nextWeek: () => void;
  thisWeek: () => void;
  openComposer: (day: number, start: number, dur?: number) => void;
  closeComposer: () => void;
  setDur: (dur: number) => void;
  startDrag: (day: number, slot: number) => void;
  dragTo: (day: number, slot: number) => void;
  endDrag: () => void;
  /** Returns true (and clears the flag) if a click follows a drag-select. */
  consumeJustDragged: () => boolean;
  confirmReserve: () => ReserveResult;
  cancelMine: (booking: MyBooking) => void;
}

export const useReserveStore = create<ReserveState>((set, get) => ({
  selFacility: DEFAULT_FACILITY,
  weekOffset: 0,
  myBookings: [],
  composer: DEFAULT_COMPOSER,
  drag: DEFAULT_DRAG,
  justDragged: false,

  setFacility: (facility) => set({ selFacility: facility }),
  prevWeek: () => set((st) => ({ weekOffset: st.weekOffset - 1 })),
  nextWeek: () => set((st) => ({ weekOffset: st.weekOffset + 1 })),
  thisWeek: () => set({ weekOffset: 0 }),

  openComposer: (day, start, dur) =>
    set({ composer: { open: true, day, start, dur: dur ?? 2 } }),
  closeComposer: () =>
    set((st) => ({ composer: { ...st.composer, open: false } })),
  setDur: (dur) => set((st) => ({ composer: { ...st.composer, dur } })),

  startDrag: (day, slot) =>
    set({ drag: { dragging: true, day, start: slot, end: slot } }),
  dragTo: (day, slot) =>
    set((st) => {
      if (!st.drag.dragging || day !== st.drag.day) return {};
      return { drag: { ...st.drag, end: slot } };
    }),
  endDrag: () => {
    const { drag } = get();
    if (!drag.dragging) return;
    const a = Math.min(drag.start, drag.end);
    const b = Math.max(drag.start, drag.end);
    set({ drag: { ...drag, dragging: false } });
    if (b > a) {
      set({ justDragged: true });
      get().openComposer(drag.day, a, b - a + 1);
    }
  },
  consumeJustDragged: () => {
    if (!get().justDragged) return false;
    set({ justDragged: false });
    return true;
  },

  confirmReserve: () => {
    const st = get();
    const base = baseBookingsFor(st.selFacility);
    const mine = st.myBookings.filter(
      (b) => b.facility === st.selFacility && b.week === st.weekOffset,
    );
    const all = [...base, ...mine];
    const cs = st.composer.start;
    const ce = st.composer.start + st.composer.dur;
    const conflict =
      ce > SLOTS ||
      all.some(
        (b) =>
          b.day === st.composer.day && cs < b.start + b.dur && b.start < ce,
      );
    if (conflict) return { ok: false, conflict: true };
    set((s) => ({
      composer: { ...s.composer, open: false },
      myBookings: [
        ...s.myBookings,
        {
          facility: s.selFacility,
          week: s.weekOffset,
          day: s.composer.day,
          start: s.composer.start,
          dur: s.composer.dur,
        },
      ],
    }));
    return { ok: true, conflict: false };
  },

  cancelMine: (booking) =>
    set((st) => ({
      myBookings: st.myBookings.filter(
        (x) =>
          !(
            x.facility === st.selFacility &&
            x.week === st.weekOffset &&
            x.day === booking.day &&
            x.start === booking.start &&
            x.dur === booking.dur
          ),
      ),
    })),
}));

/** hh:mm (Persian digits) for the start of half-hour slot `i`. */
export function slotTime(i: number): string {
  const t = START_HOUR * 60 + i * 30;
  const hh = Math.floor(t / 60);
  const mm = t % 60;
  return `${toFaDigits(String(hh).padStart(2, "0"))}:${toFaDigits(
    String(mm).padStart(2, "0"),
  )}`;
}
