"use client";

import { create } from "zustand";

import { toFaDigits } from "@/lib/persian-number";
import { SLOTS, START_HOUR } from "@/lib/reserve-time";

import type { ComposerState, DragState } from "@/types/reserve.type";

export { SLOTS, START_HOUR };
export const ROW = 32;

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
  /** Selected facility id; null until the facilities list resolves. */
  selFacilityId: string | null;
  weekOffset: number;
  composer: ComposerState;
  drag: DragState;
  /** Guards a click firing right after a drag-select release. */
  justDragged: boolean;
  setFacility: (facilityId: string) => void;
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
}

export const useReserveStore = create<ReserveState>((set, get) => ({
  selFacilityId: null,
  weekOffset: 0,
  composer: DEFAULT_COMPOSER,
  drag: DEFAULT_DRAG,
  justDragged: false,

  setFacility: (facilityId) => set({ selFacilityId: facilityId }),
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
